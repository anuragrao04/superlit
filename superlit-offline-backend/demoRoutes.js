const fs = require("fs");
const exec = require("child_process").exec;
const express = require("express");
const router = express.Router();
const { execSync } = require("child_process");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const getScore = require("./submit");

const {
  MongoClient,
  ServerApiVersion,
  Collection,
  ObjectId,
} = require("mongodb");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

async function connect_to_db() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  const dbName = "superlit_offline";
  const collectionName = "auth";

  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  return [database, collection];
}

let db, col;
connect_to_db().then(([database, collection]) => {
  db = database;
  col = collection;
  console.log("connected to db");
});

router.post("/", async (req, res) => {
  try {
    console.log("request received");
    fs.writeFile("code.c", req.body["code"], (err) => {
      if (err) {
        console.log("error writing to code.c");
      }
    });

    exec(
      `echo ${req.body["input"]} | ./compile_c.sh code.c`,
      function(error, stdout, stderr) {
        res.send(stderr + stdout);
        console.log("sent ", stderr + stdout);
      },
    );
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/submit", async (req, res) => {
  try {
    try {
      fs.writeFileSync("code.c", req.body["code"]);
    } catch (err) {
      console.log("error writing to code.c");
    }

    const command = `./only_compile.sh code.c`;
    execSync(command);

    async function run_testcase(testcase) {
      return new Promise((resolve, reject) => {
        exec(
          `echo ${testcase["input"]} | ./run_testcase.sh code.c`,
          function(error, stdout, stderr) {
            if (stdout != testcase["expected_output"]) {
              const result = {
                all_passed: false,
                test_case_failed: {
                  input: testcase["input"],
                  expected_output: testcase["expected_output"],
                  produced_output: stdout + stderr,
                },
              };
              resolve(result);
            } else {
              resolve(null);
            }
          },
        );
      });
    }

    let all_passed = true;
    let failed_test_case = {};

    for (const testcase of req.body["test_cases"]) {
      const result = await run_testcase(testcase);
      if (result) {
        all_passed = false;
        failed_test_case = result["test_case_failed"];
        break;
      }
    }

    res.send({
      all_passed: all_passed,
      test_case_failed: failed_test_case,
    });
    execSync("./delete_compiled.sh");
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/get_test_data/:test_id", async (req, res, next) => {
  // fetch test data from db
  const test_collection = db.collection("tests");
  const test_data = await test_collection.findOne({
    _id: Number(req.params.test_id),
  });
  res.send(test_data);
});

router.post("/submit_test", async (req, res, next) => {
  const test_id = req.body["test_id"];
  const srn = req.body["srn"];
  const editorData = req.body["editorData"];

  // fetch test data from db
  const test_collection = db.collection("tests");
  const test_data = await test_collection.findOne({
    _id: Number(test_id),
  });

  let scores = [];

  // run the test cases for every question. get the scores.
  for (let [i, question] of test_data["questions"].entries()) {
    const question_score = getScore(editorData[i], question["test_cases"]);
    scores[i] = question_score;
  }

  // calculate total score
  let total_score = 0;
  for (let score of scores) {
    total_score += score;
  }

  // save the score in the database
  let db_data = {
    srn: srn,
    scores: scores,
    total_score: total_score,
  };
  const responses_collection = db.collection("responses");
  await responses_collection.updateOne(
    { _id: test_id },
    {
      $push: { responses: db_data }, // Push new object to array
    },
    { upsert: true },
  );
  console.log("ungabunga");
  res.sendStatus(200);
});

router.post("/auth/login", async (req, res) => {
  // first we check if the srn (username) exists in the database
  const srn = req.body["srn"];
  const password = req.body["password"];
  const user = await col.findOne({ srn: srn });
  if (user) {
    console.log("user exists");
    console.log(password);
    console.log(user["password"]);
    if (user["password"] == password) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  } else {
    // if the srn does not exist, we create a new user
    const new_user = {
      srn: srn,
      password: password,
    };
    await col.insertOne(new_user);
    res.send({ success: true });
  }
});

router.post("/auth/forgot_password", async (req, res) => {
  const srn = req.body["srn"];
  // search for email in db
  try {
    const user = await col.findOne({ srn: srn });
    if (user) {
      const secret = JWT_SECRET + user["password"];
      const payload = {
        srn: srn,
        id: user._id,
      };
      const token = jwt.sign(payload, secret, {
        expiresIn: "15m",
      });
      let link = encodeURI(
        `http://localhost:3000/auth/reset_password/${user._id}/${token}`,
      );

      // send this link to the user's email somehow.
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
      var mailOpts = {
        from: process.env.MAIL_USER,
        to: `${srn}@pesu.pes.edu`,
        subject: "Forgot Password",
        html:
          "<h1>Superlit</h1><p>Click <a href=" +
          link +
          ">here</a> to reset your password.</p>",
      };
      transporter.sendMail(mailOpts, function(err, response) {
        if (err) {
          console.log(err);
          throw err;
        } else {
          res.sendStatus(200);
        }
      });
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post("/auth/reset_password/:id/:token", async (req, res, next) => {
  let { id, token } = req.params;
  console.log(id, token);

  // now we need to verify the token with the ID coming in
  const user = await col.findOne({ _id: new ObjectId(id) });
  if (!user) {
    res.sendStatus(404);
  } else {
    const secret = JWT_SECRET + user["password"];
    try {
      jwt.verify(token, secret);
      // the above line will throw an error if the token is invalid
      // if the token is valid, we can now reset the password
      const new_password = req.body["new_password"];
      await col.updateOne(
        { _id: new ObjectId(id) },
        { $set: { password: new_password } },
      );
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(401);
    }
  }
});

module.exports = router;

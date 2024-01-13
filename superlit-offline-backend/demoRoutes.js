const fs = require("fs");
const exec = require("child_process").exec;
const express = require("express");
const router = express.Router();
const { execSync } = require("child_process");
const jwt = require("jsonwebtoken");
let sent_token = "";
let sent_id = "";

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
      function (error, stdout, stderr) {
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
          function (error, stdout, stderr) {
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
        `http://localhost:6969/auth/reset_password/${user._id}/${token}`,
      );
      sent_id = user._id;
      sent_token = token;

      console.log(link);
      // send this link to the user's email somehow. format it with the srn
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post("/auth/reset_password/:id/:token", async (req, res, next) => {
  let { id, token } = req.params;

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

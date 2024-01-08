const e = require("child_process");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const demoRoutes = require("./demoRoutes");
const PORT = 6969;

app.use(express.json());
express.json();
app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    }),
);

app.use(bodyParser.json());
app.use("/", demoRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

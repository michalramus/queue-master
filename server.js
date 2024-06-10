const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/cors-options");

const app = express();
const port = 3001;

app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

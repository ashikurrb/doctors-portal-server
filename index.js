const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;

//middleWare
app.use(cors());

//mongoDB Connection Credentials setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.menwp.mongodb.net/?retryWrites=true&w=majority`;
// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//connect to mongoDB
async function run() {
  try {
    await client.connect();
    console.log("database connected successfully");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Doctor's  Portal Server Running!");
});

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});

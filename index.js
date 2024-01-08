const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;

//middleWare
app.use(cors());
app.use(express.json());

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
    const database = client.db('doctors_portal')
    const appointmentsCollection = database.collection('appointments')
    const usersCollection = database.collection('users');

    app.get('/appointments', async (req, res) => {
      const email = req.query.email;
      const date = new Date(req.query.date).toLocaleDateString();
      const query = { email: email, date:date }
      const cursor = appointmentsCollection.find(query);
      const appointments = await cursor.toArray();
      res.json(appointments)
    })

    app.post('/appointments', async (req, res) => {
      const appointment = req.body;
      const result = await appointmentsCollection.insertOne(appointment)
      res.json(result);
    })

    app.post ('/users', async(req, res)=>{
      const user = req.body; 
      const result = await usersCollection.insertOne(user)
      console.log(result);
      res.json(result);
    })

    app.put('/users', async(req, res)=>{
      const user = req.body;
      const filter = {email: user.email}
      const options = {upsert: true}
      const updateDoc = {$set: user}
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      console.log(result);
      res.json(result);
    })

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

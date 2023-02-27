require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fnn6vgm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const run = async () => {
  try {
    // await client.connect();
    const db = client.db("folder-collection");
    const folderCollection = db.collection("folder");

    app.get("/folders", async (req, res) => {
      const cursor = folderCollection.find({});
      const folder = await cursor.toArray();
      res.send({ status: true, data: folder });
    });

    app.post("/folders", async (req, res) => {
      const folder = req.body;

      const result = await folderCollection.insertOne(folder);

      res.send(result);
    });

    //delete a folder from  api
    app.delete("/folders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await folderCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());


const uri =
  "mongodb+srv://missionscic:7q4c0qntMQ4xYnJM@cluster0.epjhzoy.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("pet_service");
    const servicesCollection = db.collection("services");
    const ordersCollection = db.collection("orders");

   
    app.post("/services", async (req, res) => {
      const doc = req.body;
      const result = await servicesCollection.insertOne(doc);
      res.send(result);
    });

    
    app.get("/services", async (req, res) => {
      const { email, limit, category, search } = req.query;
      const query = {};

      if (email) query.email = email;
      if (category && category !== "All") query.category = category;
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      let cursor = servicesCollection.find(query).sort({ _id: -1 });

      if (limit) {
        cursor = cursor.limit(parseInt(limit));
      }

      const result = await cursor.toArray();
      res.send(result);
    });

   
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const result = await servicesCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

  
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.send(result);
    });

    
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = email ? { buyerEmail: email } : {};
      const result = await ordersCollection.find(query).toArray();
      res.send(result);
    });

    // test route
    app.get("/", (req, res) => {
      res.send("Hello, Developers");
    });

    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

// index.js (backend)
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const port = 3000; // backend runs on 3000

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection URI (you can move to .env later)
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
    const listingsCollection = db.collection("listings");
    const ordersCollection = db.collection("orders");

    // ---------- LISTINGS ROUTES ----------

    // Add new listing (AddService form)
    app.post("/services", async (req, res) => {
      try {
        const doc = req.body;
        const result = await listingsCollection.insertOne(doc);
        res.status(201).send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to add service" });
      }
    });

    // Get all listings (Pets & Supplies / Services page)
    app.get("/services", async (req, res) => {
      try {
        const { category, email, limit } = req.query;

        const query = {};
        if (category) query.category = category;
        if (email) query.email = email; 

        let cursor = listingsCollection.find(query).sort({ _id: -1 });

        if (limit) {
          cursor = cursor.limit(Number(limit));
        }

        const result = await cursor.toArray();
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch services" });
      }
    });

    // Get single listing by id (Details page)
    app.get("/services/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await listingsCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!result) {
          return res.status(404).send({ message: "Service not found" });
        }
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch service" });
      }
    });

    // Update listing (My Listings page – optional now)
    app.put("/services/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedDoc = req.body;
        const result = await listingsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedDoc }
        );
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to update service" });
      }
    });

    // Delete listing (My Listings page)
    app.delete("/services/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await listingsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to delete service" });
      }
    });

    // ---------- ORDERS ROUTES ----------

    // Create order (order modal)
    app.post("/orders", async (req, res) => {
      try {
        const doc = req.body;
        const result = await ordersCollection.insertOne(doc);
        res.status(201).send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to place order" });
      }
    });

    // Get orders for logged-in user (My Orders page)
    app.get("/orders", async (req, res) => {
      try {
        const email = req.query.email;
        const query = email ? { email } : {};
        const result = await ordersCollection
          .find(query)
          .sort({ _id: -1 })
          .toArray();
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch orders" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(" Connected to MongoDB & routes ready");
  } finally {
    // keeping connection open while server runs
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello, Developers");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

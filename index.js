const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = 3000


const app = express()
app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://missionscic:7q4c0qntMQ4xYnJM@cluster0.epjhzoy.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    await client.connect();

    const database = client.db(' pet_service')

    app.post('/services', async(req,res)=>{
      
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
     
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Hello, Developers')
})

app.listen(port, ()=>{
    console.log(`server is running on ${port}`)
})
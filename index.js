const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://TourismManagement:t7rwyEG0fPxRp4jf@cluster0.g7yl3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const spotCollection = client.db('TourismSpotDB').collection('spot')

    app.get('/spot',async(req,res)=>{
        const cursor = spotCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/spot/:id',async(req,res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const result = await spotCollection.findOne(filter)
      res.send(result)
    })
    app.post('/spot',async(req,res)=>{
        const spot = req.body
        const result = await spotCollection.insertOne(spot)
        res.send(result)
    })
    app.put('/spot/:id',async(req,res)=>{
      const id = req.params.id
      const spot = req.body

      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedSpot = {
        $set: {
          image: spot.image,
          spotName: spot.spotName,
          country: spot.country,
          location: spot.location,
          description: spot.description,
          cost: spot.cost,
          season: spot.season,
          travelTime: spot.travelTime,
          visitor: spot.visitor,
          email: spot.email,
          name: spot.name
        }
      }
      const result = await spotCollection.updateOne(filter,updatedSpot,options)
      res.send(result)
    })
    app.delete('/spot/:id',async(req,res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const result = await spotCollection.deleteOne(filter)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=> {
    res.send('I am coming')
})
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})
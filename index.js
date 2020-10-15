const express = require('express')
const bodyParser = require('body-parser')
const cors =require('cors')

const MongoClient = require('mongodb').MongoClient;
const ObjectId= require('mongodb').ObjectId;

require('dotenv').config();

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxnhm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const collection = client.db("creativeAgency").collection("order");


  app.post('/addOrder', (req, res)=>{
    const order = req.body;
    console.log(order);
    collection.insertOne(order)
    .then( result=>{
      console.log(result.insertedCount)
      res.send(result.insertedCount>0);
      
       })
})

  app.get("/", (req, res)=>{
      res.send("hello nandita")
  })

  console.log("database is started ")
  
});

app.listen((process.env.PORT ||port) , () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


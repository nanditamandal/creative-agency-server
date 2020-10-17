const express = require('express')
const bodyParser = require('body-parser')
const cors =require('cors')

const MongoClient = require('mongodb').MongoClient;
const ObjectId= require('mongodb').ObjectId;
const admin = require('firebase-admin');

require('dotenv').config();

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 5000


var serviceAccount = require("./configs/creative-agency-1b7d2-firebase-adminsdk-q74x9-66fcc19fee.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://creative-agency-1b7d2.firebaseio.com"
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxnhm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const collection = client.db("creativeAgency").collection("order");
  const adminCollection = client.db("creativeAgency").collection("admin");
  const serviceCollection = client.db("creativeAgency").collection("services");
  const reviewCollection = client.db("creativeAgency").collection("review");


  app.post('/addOrder', (req, res)=>{
    const order = req.body;
    // console.log(order);
    collection.insertOne(order)
    .then( result=>{
      console.log(result.insertedCount)
      res.send(result.insertedCount>0);
      
       })
})

app.get('/showOrder/:email',(req, res)=>{

   adminCollection.find({email: req.params.email})
   .toArray((err, document)=>{
    if(document.length>0)
    {
      collection.find({})
      .toArray((err, documents)=>{
        res.send(documents)
      })

      
    }else{
      collection.find({email: req.params.email})
      .toArray((err, documents)=>{
        res.send(documents)
      })

    }
   

   })

});

app.get('/checkUser/:userEmail', (req, res)=>{
  adminCollection.find({email: req.params.userEmail})
  .toArray((err, document)=>{
    console.log(document.length>0)
    res.send(document.length>0)
  })
})

app.get('/allService', (req, res)=>{
  serviceCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  

  })
})

app.get('/findService', (req, res)=>{
  serviceCollection.find({name : req.query.name})
  .toArray((err, document)=>{
    console.log("find one")
    res.send(document)
  

  })
})

app.post('/addAdmin', (req, res)=>{
  const order = req.body;
  // console.log(order);
  adminCollection.insertOne(order)
  .then( result=>{
    console.log(result.insertedCount)
    res.send(result.insertedCount>0);
    
     })
})

app.post('/addReview', (req, res)=>{
  const review = req.body;
  // console.log(order);
  reviewCollection.insertOne(review)
  .then( result=>{
    console.log(result.insertedCount)
    res.send(result.insertedCount>0);
    
     })
})

app.get('/allReview', (req, res)=>{
  reviewCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  

  })
})

app.post('/addService', (req, res)=>{
  const order = req.body;
  // console.log(order);
  serviceCollection.insertOne(order)
  .then( result=>{
    console.log(result.insertedCount)
    res.send(result.insertedCount>0);
    
     })
})
app.patch('/update/:id', (req, res)=>{

  collection.updateOne({_id: ObjectId(req.params.id)},
  {
      $set: {status: req.body.status}
  })
  .then(result=>{
      
     res.send(result.modifiedCount>0)
      
  }) 
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})


  console.log("database is started ")
  console.log(err)
  
});

app.listen((process.env.PORT ||port) , () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


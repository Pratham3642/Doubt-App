const express = require("express");
const cors = require("cors");
const {MongoClient} = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/save",(req,res)=>{
    const url ="mongodb+srv://prathameshmavalkar34:oqbAWpoU9owcmbdv@cluster0.on0foyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(url);
    const db = client.db("doubt");
    const coll = db.collection("doubt");
    const record ={"name":req.body.name,"phone":req.body.phone,"doubt":req.body.doubt};
    coll.insertOne(record)
    .then(result=>res.send(result))
    .catch(error=>res.send(error));
});

app.listen(3000,()=>{console.log("ready @ 3000");});



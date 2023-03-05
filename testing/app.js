
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const { ObjectId } = require("mongodb")
const methodOverride = require('method-override');
require('dotenv').config()
 
const app = express();
 
const db = require('./db');
const { appendFile } = require('fs');
db.initDb((err, db) => {
    if (err) {
        console.log(err)
    } else {
        console.log("connected")
//         const port = 3001
        app.listen(3002)
    }
})



app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

/*
app.get('/', async (req, res) => {
    const database = db.getDb().db("dbase")
   const doctors = await database.collection("doctor").find( ).toArray();
   res.render("doctors",{doctors})
})
*/
app.get('/', async (req, res) => {
     res.render("login")

})

app.get('/logout', async (req, res) => {
    res.render("login")

})
app.get('/payment', async (req, res)=>{
    res.redirect("https://rzp.io/i/m2mAjnD3k")
    const database = db.getDb().db("dbase")
    const lst4 = await database.collection("bookings").find().toArray()  

    res.render('doctor_home',{lst4})
})
app.get('/redex',function(req,res){
    res.redirect('back');
  })
app.post('/pendings',async(req,res)=>{
    const database = db.getDb().db("dbase")
    const lst4 = await database.collection("pending").find({dname:req.body.dn} ).toArray()
     
    p=[]
    for (i in lst4){
        const n = await database.collection("users").find({pid:i.pid} ).toArray()

         p.push(n[0])
        
    }
    console.log(p)
    res.render("pending",{lst4,p})
   
})

app.post('/ppendings',async(req,res)=>{
     
  const database = db.getDb().db("dbase")
   
  const lst4 = await database.collection("pending").find({pid: req.body.dn} ).toArray()
  res.render("patient_pending",{lst4})
 
})
app.post('/pbookings',async(req,res)=>{
     
    const database = db.getDb().db("dbase")
     
    const lst4 = await database.collection("bookings").find({pid: req.body.dn} ).toArray()
   res.render("patient_booking",{lst4})
   
  })

  app.post('/filter/:id',async(req,res)=>{
     
   const {id} = req.params
   const database = db.getDb().db("dbase")
   const pat = await database.collection("users").find({_id:ObjectId(id)} ).toArray()

   
   let arr = []
    
     for (i in req.body.spec)
     {
      const obj = await database.collection("doctor").find({spc :i} ).toArray()
      arr.push(obj[0])

     }
     
    //const lst4 = await database.collection("doctor").find({pid: req.body.dn} ).toArray()
     const doc = arr
 res.render("patient_home",{doc,pat})

   
  })

app.get('/confirm/:id', async (req, res) => {
    const database = db.getDb().db("dbase")
     const {id} = req.params
     const lst5 = await database.collection("pending").find({_id: ObjectId(id)}).toArray()  
     await database.collection("bookings").insert(lst5[0]);
     await database.collection("pending").findOneAndDelete({_id: ObjectId(id)})
    // await database.collection("pbooking").insert(lst5[0])
    // await database.collection("ppending").deleteOne({pid:  id})
 
 
    const lst4 = await database.collection("bookings").find({dname:lst5[0].dname}).toArray()  

     
    p=[]
    for (i in lst4){
        const n = await database.collection("users").find({pid:i.pid} ).toArray()

         p.push(n[0])
        
    }


    res.render('doctor_home',{lst4,p})
     
})



app.get('/viewdoc/:id/:pid', async (req, res) => {
   
    const {id}= req.params
    const {pid} = req.params
    const database = db.getDb().db("dbase")
    const doc1 = await database.collection("doctor").find({ _id: ObjectId(id) }).toArray()
    const today = new Date();
    const year = today.getFullYear();
    let exp_mod=year-doc1.exp

     res.render('view_doctor',{doc1,pid})

})


app.post('/booknow/:id/:pid', async (req, res) => {
   
    const {id}= req.params
    const {pid} = req.params
    const database = db.getDb().db("dbase")
    const doc1 = await database.collection("doctor").find({ _id: ObjectId(id) }).toArray()

    await database.collection("pending").insert( {dname:doc1[0].name,pid:pid,meet:"yyy",slot:req.body.cars,date:"2-12-2022"});
    await database.collection("ppending").insert( {dname:doc1[0].name,pid:pid,meet:"yyy",slot:req.body.cars,date:"2-12-2022"});


    const doc = await database.collection("doctor").find().toArray()
        const pat = await database.collection("users").find({username:req.body.username}).toArray()
        

     res.render('patient_home',{doc,pat})


})

app.post('/home',async(req,res)=>
{
    const lst = req.body
     
    const database = db.getDb().db("dbase")
    const lst1 = await database.collection("users").find({ username: req.body.username, Password: req.body.password }).toArray()
    if (lst1.length!=0)
    
    {
       if(lst1[0].sel=="doctor"){
         let p =[]
        const lst4 =   await database.collection("bookings").find({ dname: req.body.username }).toArray()
        for (i in lst4){
            const n = await database.collection("users").find({pid:i.pid} ).toArray()
    
             p.push(n[0])
            
        }

        res.render('doctor_home',{lst4,p})
       }
       else if(lst1[0].sel=="patient"){
        const doc = await database.collection("doctor").find().toArray()
        const pat = await database.collection("users").find({username:req.body.username}).toArray()
        


        res.render('patient_home',{doc,pat})
       }
    }
    else{
        res.send("Wrong credentials")
    }
})

app.get('/signup', async (req, res) => {
    res.render("signup")
})
app.post('/signup',async(req,res)=>
{
    const lst = req.body
    const database = db.getDb().db("dbase");
    await database.collection("users").insert(req.body);
    res.render('login')
})

app.get('/about',async(req,res)=>
{
    res.render("about")
})


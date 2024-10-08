const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');
const collection2 =require("./config2");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');



const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    return  res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.redirect("/");
    }

});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });

        if (!check) {
            return res.send("User name cannot found")
        }
        
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("option");
        }
    }
    catch {
        res.send("wrong Details");
    }
});
app.post("/home",async(req,res)=>{

    res.send("you have created !!" );
    const data1 = {
        note: req.body.text,
        createdAT:new Date()
    }
    const notes = await collection2.insertMany(data1);
    return console.log(notes);
});
app.post("/home_admin",async(req,res)=>{
//    res.send(`you have created !! ` );   
    const data1 = {
        note: req.body.text,
        createdAT:new Date()
    }
    const notes = await collection2.insertMany(data1);
    console.log(notes);
    res.redirect('/admin');


});
app.post("/admin",async(req,res)=>{
    try {
        const notes = await collection2.find({});
        res.render('admin', { notes });
      } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).send('Internal Server Error');
      }

});

app.post('/note/:id', async (req, res) => {
    try {
        const noteId = req.params.id; 
        console.log(noteId.toString(), "deleted sucessfully"); 
        await collection2.findByIdAndDelete(noteId); // Use noteId, not note
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).send('Internal Server Error for delete');
    }
});
app.post('/note/re/:id', async (req, res) => {
    try {
        const noteId = req.params.id; // Correct parameter access
        const newNote = req.body.rename_note;
        
        await collection2.findByIdAndUpdate(noteId, { note: newNote });
        
        res.redirect('/admin');
    } catch (error) {
        console.error('Error updating note:', error); // Correct error message
        res.status(500).send('Internal Server Error while updating the note');
    }
});
app.post('/note_create',async(req,res)=>{
    console.log("adhkd");//hjvvv
    res.render("admin_create")
});
app.get("/admin",async(req,res)=>{
    try {
        const notes = await collection2.find({});
        res.render('admin', { notes });
      } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).send('Internal Server Error');
      }


});


app.get("/user/admin",async(req,res)=>{
    const ht = await collection2.find({});
    res.json(ht);
});


app.post("/main",async(req,res)=>{
    res.render("home")

});
app.get("/about",async(req,res)=>{
    res.render("about")
});

app.get("/services",async(req,res)=>{
    res.render("services")
});

app.get("/contact",async(req,res)=>{
    res.render("contact")
});
app.get("/logout",async(req,res)=>{
    res.render("login")
});
// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
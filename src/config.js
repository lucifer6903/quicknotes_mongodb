const mongoose =require("mongoose")
const connect = mongoose.connect("mongodb://localhost:27017/");

connect.then(()=>{
    console.log("connected sucessfully");
})
.catch(()=>{
    console.log("not connected to database");
})
const loginschema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        required:true
    }
});
const collection = new mongoose.model("note",loginschema);
module.exports= collection;
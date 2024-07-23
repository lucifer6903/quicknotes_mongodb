const mongoose =require("mongoose")
const connect = mongoose.connect("mongodb://localhost:27017/");

connect.then(()=>{
    console.log("connected sucessfully");
})
.catch(()=>{
    console.log("not connected to database");
})
const loginschema= new mongoose.Schema({
    note:{
        type:String,
        required:true
    },
    createdAT:{
        type: Date, 
        default: Date.now 
    }
});
const collection = new mongoose.model("note1",loginschema);
module.exports= collection;
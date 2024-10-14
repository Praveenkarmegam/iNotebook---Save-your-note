const mongoose = require("mongoose")

const mongoURL ="mongodb://localhost:27017/iNotebookDB";

const connectToMongo = async () =>{
    await mongoose.connect(mongoURL).then(()=>
        console.log("Connected to Mongo Successfully")).catch((e)=>console.log("Some error occured :" ,e.message))
}

module.exports = connectToMongo;
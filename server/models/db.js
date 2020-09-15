const mongoose = require('mongoose');

const connection = async()=>{
   
    try{
        await mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
        console.log("mongo db connected")
    }
    catch(error){
        console.log(error.message)
    }
}
module.exports = connection;
const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors');
const connection = require('./models/db');
const app = express()
const PORT = process.env.PORT ||  5000;
connection();
app.use( express.static(__dirname+'/client/public/upload'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());
app.use(fileUpload())
app.use(require('./routes/auth'));
app.use(require('./routes/posts'));
app.use(require('./routes/user') );
if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
app.listen(PORT,()=>{
    console.log("server is running on",PORT)
})

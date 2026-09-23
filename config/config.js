const mongoose = require('mongoose')

 mongoose.connect("mongodb://127.0.0.1:27017/jobnest")
 .then(()=>console.log("connected"))
 .catch((err)=>console.log("failed db connection",err))
const mon = require("mongoose")

const url = "mongodb://0.0.0.0:27017/Sarv_DaanDB"

mon.connect(url, {useNewUrlParser:true}, (err) =>{
  if (!err){
    console.log("MongoDB Connection Successful.")
  }
  else{
    console.log("Error in MongoDB Connection: "+ err)
  }
})

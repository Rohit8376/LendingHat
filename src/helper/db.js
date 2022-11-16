const mongoose = require("mongoose");

const DB = "mongodb+srv://rohit:Rohit@123@cluster0.ferbmyj.mongodb.net/myfirstDatabase?retryWrites=true&w=majority"
mongoose.connect(DB,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology:true,
  useFindAndModify:false

})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "error connecting to db"));

db.once("open", () => console.log("database connected successfully"));

module.exports = db;

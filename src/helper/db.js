const mongoose = require("mongoose");

const DB = "mongodb+srv://rohit:4wQYafQwUNxkHiRu@cluster0.ferbmyj.mongodb.net/myfirstDatabase?retryWrites=true&w=majority"

mongoose.connect(DB,{
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "error connecting to db"));

db.once("open", () => console.log("database connected successfully"));

module.exports = db;

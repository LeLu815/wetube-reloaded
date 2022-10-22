import mongoose from "mongoose"

// mongoose.connect("mongodb://127.0.0.1:27017/wetube", {
//     useNewUrlParser:true, 
//     useUnifiedTopology:true,
// })

mongoose.connect(process.env.DB_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  });  

const db = mongoose.connection;

const handleError = (e) => console.log("💥 DB Error", e)
const handleOpen = () => console.log("Connected to DB ✨");

db.on("error", handleError)
db.once("open", handleOpen)

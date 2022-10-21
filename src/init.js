import regeneratorRuntime from "regenerator-runtime";
import 'dotenv/config'
import "./db";
import "./models/Video";
import "./models/Users"
import "./models/Comment"
import app from "./server"

const PORT = 4000;

const handleListening = () => 
    console.log(`🚀 Server is listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
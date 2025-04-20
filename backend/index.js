// import express
import express from "express";
import cors from "cors";
import Router from "./routes/routes.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();
 
// init express
const app = express();
 
// use express json
app.use(express.json());
 
// use cors
app.use(cors());

app.use(bodyParser.json());


// use router
app.use(Router);
 
app.listen(3000, () => console.log('Server running at http://localhost:3000'));
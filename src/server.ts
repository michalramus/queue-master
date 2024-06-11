import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

const allowedOrigins = ["http://127.0.0.1:5500", "http://localhost:3500"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};

app.use(cors(options));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

const allowedOrigins = ["http://127.0.0.1", "http://localhost:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};

app.use(cors(options));
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.body);
  next();
});

app.use('/clients', require('./routes/api/clients'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

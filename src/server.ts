import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(", ");

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};

app.use(cors(options));
app.use(express.json())

//TODO: Add logger and error handler
app.use((req, res, next) => {
  console.log(req.body);
  next();
});

app.use('/clients', require('./routes/api/clients'));

app.listen(port, () => {
  console.log(`Queue System Frontend APP listening on port ${port}`);
});

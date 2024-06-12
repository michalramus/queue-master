import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as socket from "./io";

dotenv.config();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(", ");

const app: Express = express();
const httpServer = require("http").createServer(app);

const io = socket.crateIO(httpServer, allowedOrigins);

const options: cors.CorsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
};

app.use(cors(options));
app.use(express.json());

//TODO: Add logger and error handler
app.use((req, res, next) => {
    console.log(req.body);
    next();
});

//Routes
app.use("/clients", require("./routes/api/clients"));


app.listen(process.env.PORT, () => {
    console.log(`Queue System Frontend APP listening on port ${process.env.PORT}`);
});

//WS
httpServer.listen(process.env.WS_PORT, () => {
    console.log("Websocket started at port ", process.env.WS_PORT);
});

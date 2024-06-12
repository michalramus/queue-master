import {Server} from "socket.io"

export let io: Server;

export function crateIO(httpServer: NodeRequire, allowedOrigins: Array<string>)
{
    io = require("socket.io")(httpServer, {
        path: "/",
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"]
        },
    });
}

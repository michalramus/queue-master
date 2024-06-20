import { Injectable } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Injectable()
@WebSocketGateway()
export class WebsocketsService {
    @WebSocketServer()
    private server: Socket;

    emit(event, data: any) {
        this.server.emit(event, data);
    }
}

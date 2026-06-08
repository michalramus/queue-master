import { Controller, Sse, MessageEvent } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { SseService } from "./sse.service";

@Controller("sse")
export class SseController {
    constructor(private readonly sseService: SseService) {}

    @Sse("events")
    sendEvents(): Observable<MessageEvent> {
        return this.sseService.getEventStream().pipe(
            map((message) => ({
                type: message.event,
                data: JSON.stringify(message.data),
            })),
        );
    }
}

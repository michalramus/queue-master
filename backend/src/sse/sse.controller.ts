import { Controller, Sse, MessageEvent } from "@nestjs/common";
import { Observable, map, merge, interval } from "rxjs";
import { SseService } from "./sse.service";

// Send a heartbeat well below undici's 300s bodyTimeout and typical proxy read timeouts
const HEARTBEAT_INTERVAL_MS = 15000;

@Controller("sse")
export class SseController {
    constructor(private readonly sseService: SseService) {}

    @Sse("events")
    sendEvents(): Observable<MessageEvent> {
        const events$: Observable<MessageEvent> = this.sseService.getEventStream().pipe(
            map((message) => ({
                type: message.event,
                data: JSON.stringify(message.data),
            })),
        );

        // Keep the stream from ever being idle so the connection is not dropped as dead.
        const heartbeat$: Observable<MessageEvent> = interval(HEARTBEAT_INTERVAL_MS).pipe(
            map(() => ({ type: "heartbeat", data: "" })),
        );

        return merge(events$, heartbeat$);
    }
}

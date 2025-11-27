import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { sseEvents } from "./sseEvents.enum";

interface SseMessage {
    event: sseEvents;
    data: any;
}

@Injectable()
export class SseService {
    private eventSubject = new Subject<SseMessage>();

    getEventStream() {
        return this.eventSubject.asObservable();
    }

    emit(event: sseEvents, data: any) {
        this.eventSubject.next({ event, data });
    }

    reloadFrontend() {
        this.emit(sseEvents.ReloadFrontend, null);
    }
}

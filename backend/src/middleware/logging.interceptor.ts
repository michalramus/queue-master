import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable, finalize } from "rxjs";

const maxArrayLength = 100;
const replacer = (key: string, value: unknown) => {
    if (key.toLowerCase().includes("password")) {
        return "********";
    }

    if (Array.isArray(value) && value.length > maxArrayLength) {
        return [...value.slice(0, maxArrayLength), `...and ${value.length - maxArrayLength} more`];
    }

    return value;
};

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger("HTTP");

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const handler = context.switchToHttp();
        const req = handler.getRequest<Request>();
        const res = handler.getResponse<Response>();

        const { method, ip, url, user } = req;

        const start = performance.now();

        return next.handle().pipe(
            finalize(() => {
                const finish = performance.now();
                const duration = (finish - start).toFixed(2);
                const { statusCode } = res;

                if (req.user) {
                    this.logger.debug(
                        `[Entity:${JSON.stringify(user)}] ${method} ${url} ${statusCode} ${duration}ms ${ip}`,
                    );
                } else {
                    this.logger.debug(`${method} ${url} ${statusCode} ${duration}ms ${ip}`);
                }
                if (req.body && Object.keys(req.body).length > 0) {
                    this.logger.verbose(JSON.stringify(req.body, replacer));
                }
            }),
        );
    }
}

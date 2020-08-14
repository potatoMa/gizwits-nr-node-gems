import { Connection } from './connection';
import { ResourceEvent, ResourceStatus } from './resource';
export declare type SubscriberEvent = ResourceEvent | 'message';
export declare class Subscriber {
    private __handler;
    private __queue;
    constructor(conn: Connection, queue: string);
    get queue(): string;
    get status(): ResourceStatus;
    ready(): Promise<void>;
    close(): Promise<void>;
    on(event: SubscriberEvent, handler: any): void;
    once(event: SubscriberEvent, handler: any): void;
    off(event: string, handler: any): void;
}

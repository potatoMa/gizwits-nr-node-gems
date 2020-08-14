import * as amqp from 'amqplib';
import { Connection } from './connection';
import { ResourceEvent, ResourceStatus } from './resource';
export declare type SenderEvent = ResourceEvent;
export declare class Sender {
    private __handler;
    private __exchange;
    constructor(conn: Connection, exchange: string);
    get exchange(): string;
    send(topic: string, payload: any, options?: amqp.Options.Publish): Promise<boolean>;
    get status(): ResourceStatus;
    ready(): Promise<void>;
    close(): Promise<void>;
    on(event: SenderEvent, handler: any): void;
    once(event: SenderEvent, handler: any): void;
    off(event: SenderEvent, handler: any): void;
}

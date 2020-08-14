import * as amqp from 'amqplib';
import { ResourceEvent, ResourceStatus } from './resource';
import { ConnectionSettings } from './settings';
export declare type ConnectionEvent = ResourceEvent | 'blocked' | 'unblocked';
export declare class Connection {
    private __conn;
    private __settings;
    constructor(settings: ConnectionSettings);
    get status(): ResourceStatus;
    close(): Promise<void>;
    createChannel(): Promise<amqp.Channel>;
    ready(): Promise<void>;
    on(event: ConnectionEvent, handler: any): void;
    once(event: ConnectionEvent, handler: any): void;
    off(event: ConnectionEvent, handler: any): void;
}

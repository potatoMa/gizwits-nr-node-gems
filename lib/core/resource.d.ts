/// <reference types="node" />
import * as events from 'events';
import { FailedAttemptError } from 'p-retry';
import { TimeoutsOptions } from 'retry';
export declare enum ResourceStatus {
    Connecting = "connecting",
    Connected = "connected",
    Error = "error",
    Closing = "closing",
    Closed = "closed"
}
export interface ResourceRetryError extends FailedAttemptError {
}
export interface ResourceRetry extends TimeoutsOptions {
}
export declare type ResourceEvent = 'open' | 'close' | 'error' | 'status' | 'retry';
export interface Resource extends events.EventEmitter {
    close(): Promise<void>;
}
export declare type ResourceFactory<T extends Resource> = () => Promise<T>;
export declare type ResourceCloser<T extends Resource> = (res: T) => Promise<void>;
export interface ResourceHandlerOptions<T extends Resource> {
    name: string;
    closer?: ResourceCloser<T>;
    retry?: ResourceRetry;
    eventBindings?: string[];
}
export declare class ResourceHandler<T extends Resource> extends events.EventEmitter {
    private __resource;
    private __factory;
    private __err?;
    private __status;
    private __opts;
    constructor(factory: ResourceFactory<T>, opts?: ResourceHandlerOptions<T>);
    get status(): ResourceStatus;
    get error(): Error | undefined;
    resource(): Promise<T>;
    connect(): Promise<void>;
    close(): Promise<void>;
    private __subscribe;
    private __connect;
    private __setToClose;
    private __setStatus;
}

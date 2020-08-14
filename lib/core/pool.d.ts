import { Connection } from './connection';
import { ConnectionSettings } from './settings';
export declare function open(settings: ConnectionSettings): Connection;
export declare function close(settings: ConnectionSettings): Promise<void>;

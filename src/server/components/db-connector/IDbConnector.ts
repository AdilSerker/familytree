import { Connection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export interface IDbConnector {
    getConnection(options: PostgresConnectionOptions): Promise<Connection>;
    closeConnection(): Promise<void>;
}

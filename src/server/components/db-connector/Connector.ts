import { createConnection, Connection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { IDbConnector } from './IDbConnector';

export class Connector implements IDbConnector {
    private static instance: IDbConnector;
    private connection: Connection;

    public static getInstance(): IDbConnector {
        if (!this.instance) {
            this.instance = new Connector();
        }

        return this.instance;
    }

    public async getConnection(options: PostgresConnectionOptions): Promise<Connection> {
        if (!this.connection) {
            this.connection = await createConnection(options);
        }

        return this.connection;
    }

    public async closeConnection(): Promise<void> {
        if (
            this.connection
            && this.connection.isConnected
        ) {
            await this.connection.close();
        }
    }
}

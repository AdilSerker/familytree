import { IDbConnector } from '../IDbConnector';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Connection } from 'typeorm';

export abstract class ConnectorDecorator implements IDbConnector {
    protected connector: IDbConnector;

    constructor(connector: IDbConnector) {
        this.connector = connector;
    }

    public getConnection(options: PostgresConnectionOptions): Promise<Connection> {
        return this.connector.getConnection(options);
    }

    public async closeConnection(): Promise<void> {
        await this.connector.closeConnection();
    }
}

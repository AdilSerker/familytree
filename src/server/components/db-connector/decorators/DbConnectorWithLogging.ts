import { Connection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConnectorDecorator } from './ConnectorDecorator';
import { IDbConnector } from '../IDbConnector';

export class DbConnectorWithLogging extends ConnectorDecorator {
    constructor(connector: IDbConnector) {
        super(connector);
    }

    public async getConnection(options: PostgresConnectionOptions): Promise<Connection> {
        const connection = <Connection>(await this.connector
            .getConnection(options)
            .catch(error => console.error(error)
        ));

        connection && connection.isConnected
                    ? console.info(`Connection to the database: ${connection.options.database} is established`)
                    : console.error(`Connection to the database: ${connection.options.database} is not established`);

        return connection;
    }
}

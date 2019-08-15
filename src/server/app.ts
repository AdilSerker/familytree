import 'reflect-metadata';

import { createExpressServer, useContainer } from 'routing-controllers';
import { createConnection } from 'typeorm';
import { Container } from 'typedi';
import * as express from 'express';
import * as path from 'path';
import * as morgan from 'morgan';
import * as bodyParser from "body-parser";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { Config, ConfigType, ServerConfig, ElasticsearchConfig } from "./components/config";
import "./components/di";
import { middlewares } from "./components/middlewares";

const dbConfig = <PostgresConnectionOptions>Config.getInstance().getConfig(ConfigType.Db);
const serverConfig = <ServerConfig>Config.getInstance().getConfig(ConfigType.Server);

serverConfig.port = +process.env.PORT;
const PUBLIC_PATH = path.join(__dirname, '../../public');
const INDEX_HTML_PATH = path.join(PUBLIC_PATH, 'index.html');
const API_BASIC_URL = '/api';

useContainer(Container);
const app = createExpressServer({
    controllers: [__dirname + '/application/web/*.js'],
    middlewares
});

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(express.static(PUBLIC_PATH));

app.use((req: Request, res: express.Response, next: express.NextFunction) => {
	if (!req.url.startsWith(API_BASIC_URL)) {
		res.sendFile(INDEX_HTML_PATH);
	} else {
		next();
	}
});

async function startServer() {
	const connection = await createConnection(dbConfig);

	connection.isConnected ?
		console.info("DB " + dbConfig.database + " is connected\n") :
		console.info("DB " + dbConfig.database + " isn't connected\n");

	app.listen(serverConfig, () => {
		console.info(`Server started at http://${serverConfig.host}:${serverConfig.port}`);
	});
}

startServer();

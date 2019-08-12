
import { Config, ConfigType, DbConfig } from "../config";

const dbConfig = Config.getInstance().getConfig(ConfigType.Db) as DbConfig;
process.stdout.write(JSON.stringify(dbConfig));

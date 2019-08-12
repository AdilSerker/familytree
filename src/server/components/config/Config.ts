import * as path from "path";
import { ConfigBuilder } from "./config-builder";

import { ConfigDictionary, ConfigType } from "./types";

const DEFAULT_ENV = "dev";
const CONFIG_PATH = path.join(__dirname, "../../../../config");

export class Config {

	public static getInstance(): Config {
		if (!this.instance) {
			this.instance = new Config();
		}

		return this.instance;
	}
	private static instance: Config;
	protected builder: ConfigBuilder;
	protected env: string;
	protected configDic: ConfigDictionary;

	private constructor() {
		this.env = this.defineEnv();
		this.builder = this.createConfigBuilder(this.env);
		this.configDic = this.initConfigDic(this.builder);
	}

	public getConfig(type: ConfigType) {
		return this.configDic[type];
	}

	public getEnv(): string {
		return this.env;
	}

	protected createConfigBuilder(env: string): ConfigBuilder {
		this.builder = new ConfigBuilder(CONFIG_PATH);
		this.builder.setEnviroment(this.env);
		return this.builder;
	}

	protected defineEnv(): string {
		let env = process.env.KICKER_ENV;

		if (!env) {
			env = DEFAULT_ENV;
		}

		return env;
	}

	protected initConfigDic(builder: ConfigBuilder): ConfigDictionary {
		return Object.keys(ConfigType).reduce(
			(obj, key: keyof typeof ConfigType) => {
				return {
					...obj,
					[ConfigType[key]]: builder.getConfig(ConfigType[key])
				};
			},
			{}
		);
	}
}

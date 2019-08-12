import * as fs from "fs";
import * as path from "path";
import { ConfigFile } from "./ConfigFile";
import { Helper } from "./Helper";

export interface OptionalParams {
	destPath?: string;
	isUsingFracturedConfigs?: boolean;
}

interface CachedConfig {
	name: string;
	env: string;
	content: any;
}

function removeFromNodeCache(id: string): void {
	delete require.cache[require.resolve(id)];
}

export class ConfigBuilder {

	private baseConfigs: ConfigFile[] = [];
	private cachedConfigs: CachedConfig[] = [];
	private configPath: string;
	private destinationPath: string;
	private isUsingFracturedConfigs: boolean;
	private env?: string;
	private readonly ENV_ERROR_STRING =
		'You must set enviroment with "setEnviroment" ' +
		"or pass it directly to executed method argument";

	constructor(configPath: string, params: OptionalParams = {}) {

		if (!Helper.isDirectory(configPath)) {
			throw new Error(`Path ${configPath} is not a valid directory`);
		}
		this.configPath = configPath;

		const dest = params.destPath || configPath;
		if (!Helper.isDirectory(dest)) {
			fs.mkdirSync(dest);
		}
		this.destinationPath = dest;
		this.isUsingFracturedConfigs = params.isUsingFracturedConfigs || false;
		this.loadBaseConfigs();
	}

	public setEnviroment(env: string) {
		this.env = env;
	}

	public build(passedEnv?: string) {
		const env = passedEnv ? passedEnv : this.env;
		console.warn(`Method "build" in ConfigBuilder is deprecated!`);
		console.warn(`Use "getConfig" to get config dynamically!`);
		if (!env) {
			throw new Error(this.ENV_ERROR_STRING);
		}
		console.info("[DEBUG] ENV: " + env);
		this.baseConfigs.forEach((config) => {
			this.createLocalConfig(config, env);
		});
	}

	public getConfig(name: string, passedEnv?: string): any {
		const env = passedEnv ? passedEnv : this.env;
		if (!env) {
			throw new Error(this.ENV_ERROR_STRING);
		}
		const baseConfig = this.baseConfigs.find((config) => config.name === name);
		if (!baseConfig) {
			throw new Error(`Cant find base config with name ${name}`);
		}

		const cachedConfig = this.cachedConfigs.find((cached) =>
			cached.name === name && cached.env === env);

		return cachedConfig ?
			cachedConfig.content :
			this.generateConfig(baseConfig, env);
	}

	public printConfigs(passedEnv?: string) {
		const env = passedEnv ? passedEnv : this.env;
		if (!env) {
			throw new Error(this.ENV_ERROR_STRING);
		}
		this.baseConfigs.forEach((configFile) => {
			console.info(`======= ${configFile.name} =======`);
			const config = this.getConfig(configFile.name, env);
			console.info(JSON.stringify(config, null, 4));
		});
	}

	public reload(): void {
		try {
			this.loadBaseConfigs();
			this.cachedConfigs.forEach((cachedConfig) => {
				const baseConfig = this.baseConfigs.find((config) => {
					return config.name === cachedConfig.name;
				});
				if (baseConfig) {
					let result: any;
					removeFromNodeCache(baseConfig.path);
					result = Object.assign(
						{},
						baseConfig.getContent()
					);
					const envConfig = this.getSpecificConfig(
						baseConfig.name,
						cachedConfig.env
					);
					if (envConfig) {
						removeFromNodeCache(envConfig.path);
						result = Object.assign(
							result,
							envConfig.getContent()
						);
					}
					const localConfig = this.getSpecificConfig(
						baseConfig.name,
						"local",
						{
							suppressWarnings: true
						}
					);
					if (localConfig) {
						removeFromNodeCache(localConfig.path);
						result = Object.assign(
							result,
							localConfig.getContent()
						);
					}
					Object.assign(cachedConfig.content, result);
				}
			});
		} catch (err) {
			console.warn(err);
		}
	}

	private generateConfig(baseConfig: ConfigFile, env: string): any {
		let result = baseConfig.getContent();

		const envConfig = this.getSpecificConfig(baseConfig.name, env);
		if (envConfig) {
			const envContent = envConfig.getContent();
			result = Object.assign({}, result, envContent);
		}

		const localConfig = this.getSpecificConfig(
			baseConfig.name,
			"local",
			{
				suppressWarnings: true
			}
		);

		if (localConfig) {
			const localContent = localConfig.getContent();
			result = Object.assign(result, localContent);
		}

		this.cachedConfigs.push({
			env,
			name: baseConfig.name,
			content: result
		});

		return result;
	}

	private loadBaseConfigs() {
		const directory = path.join(this.configPath, "base");
		this.baseConfigs = this.getConfigsInDirectory(directory);
	}

	private getConfigsInDirectory(
			directory: string,
			options?: {suppressWarnings?: boolean}):
			ConfigFile[] {
		let results: ConfigFile[] = [];
		if (Helper.isDirectory(directory)) {
			const paths = this.isUsingFracturedConfigs ?
				Helper.getConfigAllPathList(directory) :
				Helper.getConfigFilePathList(directory);
			results = paths.map((item) => new ConfigFile(item));
		} else if (!options || !options.suppressWarnings) {
			console.warn(`[WARN] Cant find directory ${directory}`);
		}
		return results;
	}

	/**
     * @deprecated
     */
	private createLocalConfig(baseConfig: ConfigFile, env: string) {
		const name = baseConfig.name;
		const config = this.generateConfig(baseConfig, env);
		const existingConfig = this.getSpecificConfig(name, ".");
		if (existingConfig) {
			console.warn("[WARN] Config exists: "
				+ existingConfig.filename + ". Rewriting");
		}
		const newPath = path.join(this.destinationPath, name + ".json");
		const generatedConfig = JSON.stringify(config, null, 4);
		fs.writeFileSync(newPath, generatedConfig);
	}

	private getSpecificConfig(
			name: string,
			env: string,
			options?: {suppressWarnings?: boolean}):
			ConfigFile | undefined {
		const directory = path.join(this.configPath, env);
		const configs = this.getConfigsInDirectory(directory, options);
		return configs.find((configFile) => configFile.name === name);
	}
}

import * as path from "path";
import { Helper } from "./Helper";

/**
 * Represents config file acquired from either single file or directory
 * of files
 */
export class ConfigFile {
	private path_: string;
	constructor(filepath: string) {
		this.path_ = filepath;
	}

	public get path(): string {
		return this.path_;
	}

	public get filename(): string {
		return path.basename(this.path);
	}

	/**
     * returns filename without extension
     */
	public get name(): string {
		return path.parse(this.filename).name;
	}

	public get extension(): string {
		return path.extname(this.filename);
	}

	/**
     * returns content in json format
     */
	public getContent(): any {
		let result = {};

		if (Helper.isDirectory(this.path)) {
			const paths = Helper.getConfigFilePathList(this.path);
			result = paths.reduce(
				(prev, next) => (Object.assign(prev, require(next))),
				{}
			);
		} else {
			result = require(this.path);
		}

		return result;
	}
}

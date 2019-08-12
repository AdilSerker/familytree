import * as fs from "fs";
import * as path from "path";

export class Helper {

	public static getConfigFilePathList(directory: string): string[] {
		return Helper.getConfigPathList(directory);
	}

	public static getConfigAllPathList(directory: string): string[] {
		return Helper.getConfigPathList(directory, {
			isConsideringFractured: true
		});
	}

	public static isDirectory(pathfile: string): boolean {
		let res: boolean;

		try {
			res = fs.lstatSync(pathfile).isDirectory();
		} catch (e) {
			if (e.code === "ENOENT") {
				res = false;
			} else {
				throw e;
			}
		}

		return res;
	}

	private static getConfigPathList(
		directory: string,
		options: {isConsideringFractured?: boolean} = {}
	): string[] {

		return fs.readdirSync(directory)
			.filter((filename) => (
				path.extname(filename) === ".js" ||
				path.extname(filename) === ".json") ||
				(
					options && options.isConsideringFractured &&
					Helper.isDirectory(path.join(directory, filename))
				)
			)
			.map((filename) => path.join(directory, filename));
	}
}

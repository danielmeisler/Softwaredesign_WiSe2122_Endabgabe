"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileHandler {
    constructor() {
        if (FileHandler._instance)
            throw new Error("Use FileHandler.getInstance() instead new FileHandler()");
        FileHandler._instance = this;
    }
    static getInstance() {
        return FileHandler._instance;
    }
    readFile(pathToFile) {
        let jsonRaw = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../" + pathToFile));
        let json = JSON.parse(jsonRaw.toString());
        return json;
    }
    readArrayFile(pathToFile) {
        return this.readFile(pathToFile);
    }
    readObjectFile(pathToFile) {
        return this.readFile(pathToFile);
    }
    writeFile(pathToFile, dataToWrite) {
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, "../" + pathToFile), JSON.stringify(dataToWrite));
    }
    deleteFile(pathToFile, position) {
        let json = this.readFile(pathToFile);
        json.splice(position, 1);
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, "../" + pathToFile), JSON.stringify(json));
    }
}
exports.FileHandler = FileHandler;
FileHandler._instance = new FileHandler();
exports.default = FileHandler.getInstance();
//# sourceMappingURL=FileHandler.js.map
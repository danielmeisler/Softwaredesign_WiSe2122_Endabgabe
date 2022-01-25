"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
class Console {
    constructor() {
        this.consoleLine = readline_1.default.createInterface({ input: process.stdin, output: process.stdout });
        if (Console.instance) {
            throw new Error("Instead of using new Console(), please use Console.getInstance() for Singleton!");
        }
        else {
            Console.instance = this;
        }
    }
    static getInstance() {
        return Console.instance;
    }
    printLine(line) {
        this.consoleLine.write(line);
        this.consoleLine.write("\n");
    }
}
Console.instance = new Console();
exports.default = Console.getInstance();
//# sourceMappingURL=Console.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = __importDefault(require("prompts"));
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
    question(_question, _type) {
        return (0, prompts_1.default)({
            type: _type,
            name: 'value',
            message: _question
        });
    }
    showOptions(_options, _question) {
        let choices = [];
        for (let i = 1; i <= _options.length; i++) {
            choices.push({ title: _options[i - 1], value: i });
        }
        return (0, prompts_1.default)({
            type: 'select',
            name: 'value',
            message: _question,
            choices: choices
        });
    }
    static getInstance() {
        return Console.instance;
    }
    printLine(line) {
        this.consoleLine.write(line);
        this.consoleLine.write("\n");
    }
    closeConsole() {
        this.consoleLine.close();
    }
}
Console.instance = new Console();
exports.default = Console.getInstance();
//# sourceMappingURL=Console.js.map
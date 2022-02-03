"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const App_1 = __importDefault(require("./App"));
const Console_1 = __importDefault(require("./classes/singletons/Console"));
const FileHandler_1 = __importDefault(require("./classes/singletons/FileHandler"));
class Login {
    showLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            Console_1.default.printLine("Login");
            let usernameQuestion = yield Console_1.default.question("Username: ", "text");
            let passwordQuestion = yield Console_1.default.question("Password: ", "password");
            this.handleUser(usernameQuestion.value, passwordQuestion.value);
        });
    }
    handleUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield FileHandler_1.default.readArrayFile("./../../data/users.json");
            let succes = false;
            let currentUser = users[0];
            for (let i = 0; i < users.length; i++) {
                if (users[i].username == username && users[i].password == password) {
                    currentUser = users[i];
                    succes = true;
                }
            }
            if (succes == true) {
                Console_1.default.printLine("You have successfully logged in!");
                let app = new App_1.default();
                app.showHome(currentUser);
            }
            else {
                Console_1.default.printLine("Your login was incorrect, please try again!");
                this.showLogin();
            }
        });
    }
}
exports.Login = Login;
exports.default = Login;
//# sourceMappingURL=Login.js.map
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
exports.App = void 0;
const Articles_1 = require("./classes/Articles");
const Customers_1 = require("./classes/Customers");
const Orders_1 = require("./classes/Orders");
const Users_1 = require("./classes/Users");
const Console_1 = __importDefault(require("./classes/singletons/Console"));
class App {
    constructor() { }
    showHome(currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            Console_1.default.printLine("--Homepage: Welcome " + currentUser.username + "!--");
            if (currentUser.admin == true) {
                let answer = yield Console_1.default.showOptions([
                    "1. Articles",
                    "2. Customers",
                    "3. Orders",
                    "4. [ADMIN] Users"
                ], "Which section do you want to edit?");
                this.handleAnswer(answer.value);
            }
            else {
                let answer = yield Console_1.default.showOptions([
                    "1. Articles",
                    "2. Customers",
                    "3. Orders"
                ], "Which section do you want to edit?");
                this.handleAnswer(answer.value);
            }
        });
    }
    handleAnswer(answer) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (answer) {
                case 1:
                    let articles = new Articles_1.Articles();
                    articles.showArticleOptions();
                    break;
                case 2:
                    let customers = new Customers_1.Customers();
                    customers.showCustomerOptions();
                    break;
                case 3:
                    let orders = new Orders_1.Orders();
                    orders.showOrderOptions();
                    break;
                case 4:
                    let users = new Users_1.Users();
                    users.showUserOptions();
                    break;
                default:
                    break;
            }
        });
    }
}
exports.App = App;
exports.default = App;
//# sourceMappingURL=App.js.map
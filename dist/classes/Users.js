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
exports.Users = void 0;
const Console_1 = __importDefault(require("./singletons/Console"));
const FileHandler_1 = __importDefault(require("./singletons/FileHandler"));
class Users {
    constructor() { }
    showUserOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            Console_1.default.printLine("User Page");
            let answer = yield Console_1.default.showOptions([
                "1. Search an user",
                "2. Show list of users",
                "3. Create a new user"
            ], "Users: What do you want to do?");
            this.handleUserAnswer(answer.value);
        });
    }
    handleUserAnswer(answer) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield FileHandler_1.default.readArrayFile("./../../data/users.json");
            switch (answer) {
                case 1:
                    let userSearch = yield Console_1.default.question("Search by username", "text");
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].username.includes(userSearch.value)) {
                            yield Console_1.default.showOptions([users[i].username.toString()], "All found users: ");
                            this.handleSelectedUser(users[i]);
                        }
                    }
                    break;
                case 2:
                    yield Console_1.default.showOptions(["[" + users.toString() + "] " + users], "All available users: ");
                    break;
                default:
                    Console_1.default.printLine("Option not available!");
                    break;
            }
        });
    }
    handleSelectedUser(selectedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            Console_1.default.printLine("What do you want to do with " + selectedUser.username + " ?");
            let answer = yield Console_1.default.showOptions([
                "1. Edit username",
                "2. Edit password",
                "3. Edit admin rights"
            ], "What do you want to do with the selected user?");
            //this.handleSelecteduserAnswer(answer.value);   
        });
    }
}
exports.Users = Users;
//# sourceMappingURL=Users.js.map
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
exports.Customers = void 0;
const Console_1 = __importDefault(require("./singletons/Console"));
const FileHandler_1 = __importDefault(require("./singletons/FileHandler"));
class Customers {
    constructor() { }
    showCustomerOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            Console_1.default.printLine("Customer Page");
            let answer = yield Console_1.default.showOptions([
                "1. Search a customer",
                "2. Show list of customers",
                "3. Create a new customer"
            ], "Customers: What do you want to do?");
            this.handleCustomerAnswer(answer.value);
        });
    }
    handleCustomerAnswer(answer) {
        return __awaiter(this, void 0, void 0, function* () {
            let customers = yield FileHandler_1.default.readArrayFile("./../../data/customers.json");
            switch (answer) {
                case 1:
                    let customerSearch = yield Console_1.default.question("Search by ID or name", "text");
                    for (let i = 0; i < customers.length; i++) {
                        if (customers[i].id.includes(customerSearch.value) || customers[i].last_name.includes(customerSearch.value) || customers[i].first_name.includes(customerSearch.value)) {
                            yield Console_1.default.showOptions(["[" + customers[i].id.toString() + "] " + customers[i].last_name.toString() + " " + customers[i].first_name.toString()], "All found customers: ");
                            this.handleSelectedCustomer(customers[i]);
                        }
                    }
                    break;
                case 2:
                    yield Console_1.default.showOptions(["[" + customers.toString() + "] " + customers], "All available customers: ");
                    break;
                default:
                    Console_1.default.printLine("Option not available!");
                    break;
            }
        });
    }
    handleSelectedCustomer(selectedCustomer) {
        return __awaiter(this, void 0, void 0, function* () {
            Console_1.default.printLine("What do you want to do with [" + selectedCustomer.id + "] " + selectedCustomer.last_name + " " + selectedCustomer.first_name + " ?");
            let answer = yield Console_1.default.showOptions([
                "1. Edit customer",
                "2. Show statistics",
                "3. Make an order"
            ], "What do you want to do with the selected Customer?");
            //this.handleSelectedArticleAnswer(answer.value);   
        });
    }
}
exports.Customers = Customers;
//# sourceMappingURL=Customers.js.map
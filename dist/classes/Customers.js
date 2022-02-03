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
    constructor() {
        this.customers = FileHandler_1.default.readArrayFile("./../../data/customers.json");
    }
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
            let customerArray = [];
            switch (answer) {
                case 1:
                    let customerSearch = yield Console_1.default.question("Search by ID or name", "text");
                    for (let i = 0; i < this.customers.length; i++) {
                        if (this.customers[i].id.includes(customerSearch.value) || this.customers[i].last_name.includes(customerSearch.value) || this.customers[i].first_name.includes(customerSearch.value)) {
                            customerArray.push("[" + this.customers[i].id + "] " + this.customers[i].last_name + ", " + this.customers[i].first_name);
                        }
                    }
                    let foundCustomer = yield Console_1.default.showOptions(customerArray, "All found customers: ");
                    this.handleSelectedCustomer(foundCustomer.value - 1);
                    break;
                case 2:
                    for (let i = 0; i < this.customers.length; i++) {
                        customerArray.push("[" + this.customers[i].id + "] " + this.customers[i].last_name + ", " + this.customers[i].first_name);
                    }
                    let selectedCustomer = yield Console_1.default.showOptions(customerArray, "All available customers: ");
                    this.handleSelectedCustomer(selectedCustomer.value - 1);
                    break;
                default:
                    Console_1.default.printLine("Option not available!");
                    break;
            }
        });
    }
    handleSelectedCustomer(selectedCustomer) {
        return __awaiter(this, void 0, void 0, function* () {
            let answer = yield Console_1.default.showOptions([
                "1. Edit customer",
                "2. Show statistics",
                "3. Make an order"
            ], "What do you want to do with [" + this.customers[selectedCustomer].id + "] " + this.customers[selectedCustomer].last_name + ", " + this.customers[selectedCustomer].first_name + "?");
            //this.handleSelectedArticleAnswer(answer.value);   
        });
    }
}
exports.Customers = Customers;
//# sourceMappingURL=Customers.js.map
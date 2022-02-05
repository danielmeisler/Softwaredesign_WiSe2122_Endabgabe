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
                case 3:
                    this.createNewCustomer();
                default:
                    break;
            }
        });
    }
    handleSelectedCustomer(selectedCustomer) {
        return __awaiter(this, void 0, void 0, function* () {
            let answer = yield Console_1.default.showOptions([
                "1. Edit customer",
                "2. Delete customer",
                "3. Show statistics",
                "4. Make an order"
            ], "What do you want to do with [" + this.customers[selectedCustomer].id + "] " + this.customers[selectedCustomer].last_name + ", " + this.customers[selectedCustomer].first_name + "?");
            switch (answer.value) {
                case 1:
                    this.editCustomer(selectedCustomer);
                    break;
                case 2:
                    FileHandler_1.default.deleteFile("./../../data/customers.json", selectedCustomer);
                    break;
                case 3:
                    break;
                case 4:
                    break;
                default:
                    break;
            }
        });
    }
    createNewCustomer() {
        return __awaiter(this, void 0, void 0, function* () {
            Console_1.default.printLine("--Please follow the steps to create a new customer--");
            let allCustomers = this.customers;
            let newCustomer = {};
            let idTemplate = "CNR";
            let idQuestion = yield Console_1.default.question("Pick three numbers for the id: ", "number");
            let fullID = idTemplate + idQuestion.value;
            newCustomer.id = fullID;
            let lastNameQuestion = yield Console_1.default.question("Last Name: ", "text");
            newCustomer.last_name = lastNameQuestion.value;
            let firstNameQuestion = yield Console_1.default.question("First Name: ", "text");
            newCustomer.first_name = firstNameQuestion.value;
            let streetNumberAddressQuestion = yield Console_1.default.question("Street/House Number: ", "text");
            newCustomer.street_number_address = streetNumberAddressQuestion.value;
            let postalCodeQuestion = yield Console_1.default.question("Postal Code: ", "number");
            newCustomer.postal_code = postalCodeQuestion.value;
            let cityQuestion = yield Console_1.default.question("City: ", "text");
            newCustomer.city = cityQuestion.value;
            let discountPercentageQuestion = yield Console_1.default.question("Discount percentage: ", "number");
            newCustomer.discount_percentage = discountPercentageQuestion.value;
            allCustomers.push(newCustomer);
            FileHandler_1.default.writeFile("./../../data/customers.json", allCustomers);
        });
    }
    editCustomer(selectedCustomer) {
        return __awaiter(this, void 0, void 0, function* () {
            Console_1.default.printLine("--Please follow the steps to edit the customer--");
            let allCustomers = this.customers;
            let idTemplate = "CNR";
            let idQuestion = yield Console_1.default.question("Pick three new numbers to replace '" + allCustomers[selectedCustomer].id + "': ", "number");
            let fullID = idTemplate + idQuestion.value;
            allCustomers[selectedCustomer].id = fullID;
            let lastNameQuestion = yield Console_1.default.question("Replace Last Name '" + allCustomers[selectedCustomer].last_name + "': ", "text");
            allCustomers[selectedCustomer].last_name = lastNameQuestion.value;
            let firstNameQuestion = yield Console_1.default.question("Replace First Name '" + allCustomers[selectedCustomer].first_name + "': ", "text");
            allCustomers[selectedCustomer].first_name = firstNameQuestion.value;
            let streetNumberAddressQuestion = yield Console_1.default.question("Replace Street/Number '" + allCustomers[selectedCustomer].street_number_address + "': ", "text");
            allCustomers[selectedCustomer].street_number_address = streetNumberAddressQuestion.value;
            let postalCodeQuestion = yield Console_1.default.question("Replace Postal code '" + allCustomers[selectedCustomer].postal_code + "': ", "number");
            allCustomers[selectedCustomer].postal_code = postalCodeQuestion.value;
            let cityQuestion = yield Console_1.default.question("Replace City '" + allCustomers[selectedCustomer].city + "': ", "text");
            allCustomers[selectedCustomer].city = cityQuestion.value;
            let discountPercentageQuestion = yield Console_1.default.question("Replace Discount Percentage '" + allCustomers[selectedCustomer].discount_percentage + "': ", "number");
            allCustomers[selectedCustomer].discount_percentage = discountPercentageQuestion.value;
            FileHandler_1.default.writeFile("./../../data/customers.json", allCustomers);
        });
    }
}
exports.Customers = Customers;
//# sourceMappingURL=Customers.js.map
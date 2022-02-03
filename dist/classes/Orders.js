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
exports.Orders = void 0;
const Console_1 = __importDefault(require("./singletons/Console"));
const FileHandler_1 = __importDefault(require("./singletons/FileHandler"));
class Orders {
    constructor() { }
    showOrderOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            Console_1.default.printLine("Order Page");
            let answer = yield Console_1.default.showOptions([
                "1. Search an order",
                "2. Show list of orders",
                "3. Create a new order"
            ], "Orders: What do you want to do?");
            this.handleOrderAnswer(answer.value);
        });
    }
    handleOrderAnswer(answer) {
        return __awaiter(this, void 0, void 0, function* () {
            let orders = yield FileHandler_1.default.readArrayFile("./../../data/orders.json");
            switch (answer) {
                case 1:
                    let orderSearch = yield Console_1.default.question("Search by ID or customer", "text");
                    for (let i = 0; i < orders.length; i++) {
                        if (orders[i].id.includes(orderSearch.value) || orders[i].customer.toString().includes(orderSearch.value)) {
                            yield Console_1.default.showOptions(["[" + orders[i].id.toString() + "] " + orders[i].customer.toString()], "All found orders: ");
                            this.handleSelectedOrder(orders[i]);
                        }
                    }
                    break;
                case 2:
                    yield Console_1.default.showOptions(["[" + orders.toString() + "] " + orders], "All available orders: ");
                    break;
                default:
                    Console_1.default.printLine("Option not available!");
                    break;
            }
        });
    }
    handleSelectedOrder(selectedOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            Console_1.default.printLine("What do you want to do with [" + selectedOrder.id + "] " + selectedOrder.customer + " ?");
            let answer = yield Console_1.default.showOptions([
                "1. Edit order",
                "2. Show statistics",
            ], "What do you want to do with the selected Order?");
            //this.handleSelectedArticleAnswer(answer.value);   
        });
    }
}
exports.Orders = Orders;
//# sourceMappingURL=Orders.js.map
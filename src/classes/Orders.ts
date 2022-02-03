import { Answers } from 'prompts';
import { OrderDAO } from './dao/orderDao';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Orders {
    
    constructor() {}

    public orders: OrderDAO[] = FileHandler.readArrayFile("./../../data/orders.json");

    public async showOrderOptions(): Promise<void> {
        Console.printLine("Order Page");

        let answer: Answers<string> = await Console.showOptions(
            [
                "1. Search an order",
                "2. Show list of orders",
                "3. Create a new order"
            ],
            "Orders: What do you want to do?");
      
          this.handleOrderAnswer(answer.value);
    }

    public async handleOrderAnswer(answer: number): Promise<void> {
        
        let orderArray: string[] = [];

        switch (answer) {
            case 1:

                let orderSearch: Answers<string> = await Console.question("Search by ID or customer", "text");

                for (let i: number = 0; i < this.orders.length; i++) {
                    if (this.orders[i].id.includes(orderSearch.value) || this.orders[i].order_date.toString().includes(orderSearch.value) || this.orders[i].customer.last_name.toString().includes(orderSearch.value) || this.orders[i].customer.first_name.toString().includes(orderSearch.value)) {
                        orderArray.push("["+ this.orders[i].id + "] " + this.orders[i].order_date + " - " + this.orders[i].customer.last_name + ", " + this.orders[i].customer.first_name);
                    }
                }

                let foundOrder: Answers<string> = await Console.showOptions(orderArray,"All found orders: ");
                this.handleSelectedOrder(foundOrder.value - 1);

                break;
            case 2:

                for (let i: number = 0; i < this.orders.length; i++) {
                    orderArray.push("["+ this.orders[i].id + "] " + this.orders[i].order_date + " - " + this.orders[i].customer.last_name + ", " + this.orders[i].customer.first_name);
                }

                let selectedOrder: Answers<string> = await Console.showOptions(orderArray,"All available orders: ");
                this.handleSelectedOrder(selectedOrder.value - 1);

                break;
            default:
                Console.printLine("Option not available!");
                break;
        }
    }

    public async handleSelectedOrder(selectedOrder: number): Promise<void> {

        let answer: Answers<string> = await Console.showOptions(
            [
              "1. Edit order",
              "2. Show statistics",
            ],
            "What do you want to do with [" + this.orders[selectedOrder].id + "] " + this.orders[selectedOrder].order_date + " - " + this.orders[selectedOrder].customer.last_name + ", " + this.orders[selectedOrder].customer.first_name);
      
          //this.handleSelectedArticleAnswer(answer.value);   
    }
}
import { Answers } from 'prompts';
import { OrderDAO } from './dao/orderDao';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Orders {
    
    constructor() {}

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

        let orders: OrderDAO[] = await FileHandler.readArrayFile("./../../data/orders.json");

        switch (answer) {
            case 1:
                let orderSearch: Answers<string> = await Console.question("Search by ID or customer", "text");

                for (let i: number = 0; i < orders.length; i++) {
                    if (orders[i].id.includes(orderSearch.value) || orders[i].customer.toString().includes(orderSearch.value)) {
                        await Console.showOptions(["["+ orders[i].id.toString() + "] " + orders[i].customer.toString()],"All found orders: ");
                        this.handleSelectedOrder(orders[i]);
                    }
                }
                break;
            case 2:


                    await Console.showOptions(["["+ orders.toString() + "] " + orders],"All available orders: ");
                break;
            default:
                Console.printLine("Option not available!");
                break;
        }
    }

    public async handleSelectedOrder(selectedOrder: OrderDAO): Promise<void> {
        Console.printLine("What do you want to do with [" + selectedOrder.id + "] " + selectedOrder.customer + " ?");

        let answer: Answers<string> = await Console.showOptions(
            [
              "1. Edit order",
              "2. Show statistics",
            ],
            "What do you want to do with the selected Order?");
      
          //this.handleSelectedArticleAnswer(answer.value);   
    }
}
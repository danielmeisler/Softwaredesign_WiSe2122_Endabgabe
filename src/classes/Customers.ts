import { Answers } from 'prompts';
import { CustomerDAO } from './dao/customerDao';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Customers {
    
    constructor() {}

    public async showCustomerOptions(): Promise<void> {
        Console.printLine("Customer Page");

        let answer: Answers<string> = await Console.showOptions(
            [
                "1. Search a customer",
                "2. Show list of customers",
                "3. Create a new customer"
            ],
            "Customers: What do you want to do?");
      
          this.handleCustomerAnswer(answer.value);
    }

    public async handleCustomerAnswer(answer: number): Promise<void> {

        let customers: CustomerDAO[] = await FileHandler.readArrayFile("./../../data/customers.json");

        switch (answer) {
            case 1:
                let customerSearch: Answers<string> = await Console.question("Search by ID or name", "text");

                for (let i: number = 0; i < customers.length; i++) {
                    if (customers[i].id.includes(customerSearch.value) || customers[i].last_name.includes(customerSearch.value) || customers[i].first_name.includes(customerSearch.value)) {
                        await Console.showOptions(["["+ customers[i].id.toString() + "] " + customers[i].last_name.toString() + " " + customers[i].first_name.toString()],"All found customers: ");
                        this.handleSelectedCustomer(customers[i]);
                    }
                }
                break;
            case 2:


                    await Console.showOptions(["["+ customers.toString() + "] " + customers],"All available customers: ");
                break;
            default:
                Console.printLine("Option not available!");
                break;
        }
    }

    public async handleSelectedCustomer(selectedCustomer: CustomerDAO): Promise<void> {
        Console.printLine("What do you want to do with [" + selectedCustomer.id + "] " + selectedCustomer.last_name + " " + selectedCustomer.first_name + " ?");

        let answer: Answers<string> = await Console.showOptions(
            [
              "1. Edit customer",
              "2. Show statistics",
              "3. Make an order"
            ],
            "What do you want to do with the selected Customer?");
      
          //this.handleSelectedArticleAnswer(answer.value);   
    }
}
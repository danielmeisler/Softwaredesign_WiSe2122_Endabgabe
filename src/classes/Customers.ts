import { Answers } from 'prompts';
import { CustomerDAO } from './dao/customerDao';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Customers {
    
    constructor() {}

    public customers: CustomerDAO[] = FileHandler.readArrayFile("./../../data/customers.json");

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

        let customerArray: string[] = [];

        switch (answer) {
            case 1:

                let customerSearch: Answers<string> = await Console.question("Search by ID or name", "text");

                for (let i: number = 0; i < this.customers.length; i++) {
                    if (this.customers[i].id.includes(customerSearch.value) || this.customers[i].last_name.includes(customerSearch.value) || this.customers[i].first_name.includes(customerSearch.value)) {
                        customerArray.push("["+ this.customers[i].id + "] " + this.customers[i].last_name + ", " + this.customers[i].first_name);
                    }
                }

                let foundCustomer: Answers<string> = await Console.showOptions(customerArray,"All found customers: ");
                this.handleSelectedCustomer(foundCustomer.value - 1);

                break;
            case 2:

                for (let i: number = 0; i < this.customers.length; i++) {
                    customerArray.push("["+ this.customers[i].id + "] " + this.customers[i].last_name + ", " + this.customers[i].first_name);
                }

                let selectedCustomer: Answers<string> = await Console.showOptions(customerArray,"All available customers: ");
                this.handleSelectedCustomer(selectedCustomer.value - 1);
                break;
            default:
                Console.printLine("Option not available!");
                break;
        }
    }

    public async handleSelectedCustomer(selectedCustomer: number): Promise<void> {

        let answer: Answers<string> = await Console.showOptions(
            [
              "1. Edit customer",
              "2. Show statistics",
              "3. Make an order"
            ],
            "What do you want to do with [" + this.customers[selectedCustomer].id + "] " + this.customers[selectedCustomer].last_name + ", " + this.customers[selectedCustomer].first_name + "?");
      
          //this.handleSelectedArticleAnswer(answer.value);   
    }
}
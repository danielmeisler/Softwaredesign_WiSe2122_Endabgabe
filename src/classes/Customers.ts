import { App } from '../App';
import { Answers } from 'prompts';
import { CustomerDAO } from './dao/customerDao';
import { CustomerStatsDAO } from './dao/statisticDao';
import { Orders } from './Orders';
import { Statistics } from './Statistics';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Customers {
    
    constructor() {}

    public customers: CustomerDAO[] = FileHandler.readArrayFile("./../../data/customers.json");
    public customerStats: CustomerStatsDAO[] = FileHandler.readArrayFile("./../../data/customersStatistics.json");

    // show customer menu

    public async showCustomerOptions(): Promise<void> {

        let answer: Answers<string> = await Console.showOptions(
            [
                "1. Search a customer",
                "2. Show list of customers",
                "3. Create a new customer",
                "4. [<-] Go back"
            ],
            "Customers: What do you want to do?");
          this.handleCustomerAnswer(answer.value);
    }

    // processes the input and lets you search for an customer or create one

    public async handleCustomerAnswer(answer: number): Promise<void> {
        let customerArray: string[] = [];

        switch (answer) {
            case 1:
                let customerSearch: Answers<string> = await Console.question("Search by ID or name", "text");

                for (let i: number = 0; i < this.customers.length; i++) {
                    if (this.customers[i].id.includes(customerSearch.value) || this.customers[i].last_name.includes(customerSearch.value) || this.customers[i].first_name.includes(customerSearch.value)) {
                        customerArray.push("["+ this.customers[i].id + "] " + this.customers[i].last_name + ", " + this.customers[i].first_name);
                    } else {
                        Console.printLine("--Sorry, your input was not found. Please try again--")
                        this.showCustomerOptions();
                    }
                }

                let foundCustomer: Answers<string> = await Console.showOptions(customerArray,"All found customers: ");
                this.handleSelectedCustomer(foundCustomer.value - 1);
                break;

            case 2:
                this.customers = FileHandler.readArrayFile("./../../data/customers.json");
                for (let i: number = 0; i < this.customers.length; i++) {
                    customerArray.push("["+ this.customers[i].id + "] " + this.customers[i].last_name + ", " + this.customers[i].first_name);
                }
                let selectedCustomer: Answers<string> = await Console.showOptions(customerArray,"All available customers: ");
                this.handleSelectedCustomer(selectedCustomer.value - 1);
                break;

            case 3:
                this.createNewCustomer();
                break;

            case 4:
                let app: App = new App();
                app.showHome();
                break;

            default:
                Console.printLine("Option not available!");
                break;
        }

    }

   // if you search or display the customers you can edit, delete, look up the statistics or make an order

    public async handleSelectedCustomer(selectedCustomer: number): Promise<void> {

        let answer: Answers<string> = await Console.showOptions(
            [
              "1. Edit customer",
              "2. Delete customer",
              "3. Show statistics",
              "4. Make an order",
              "5. [<-] Go back"
            ],
            "What do you want to do with [" + this.customers[selectedCustomer].id + "] " + this.customers[selectedCustomer].last_name + ", " + this.customers[selectedCustomer].first_name + "?");

          switch (answer.value) {
            case 1:
                this.editCustomer(selectedCustomer);
                break;
            case 2:
                FileHandler.deleteFile("./../../data/customers.json", selectedCustomer);
                FileHandler.deleteFile("./../../data/customersStatistics.json", selectedCustomer);
                Console.printLine("--Customer succesfully deleted--");
                this.showCustomerOptions();
                break;
            case 3:
                let statistics: Statistics = new Statistics();
                statistics.showCustomerStatistics(selectedCustomer);
                break;
            case 4:
                let order: Orders = new Orders();
                order.showOrderOptions();
                break;
            case 5:
                this.showCustomerOptions();
            default:
                Console.printLine("Option not available!");
                break;
        }

    }

    // creates a customer and asks you every needed information to put it in a json

    public async createNewCustomer(): Promise<void> {
        Console.printLine("--Please follow the steps to create a new customer--");
        let allCustomers: CustomerDAO[] = this.customers;
        let newCustomer: CustomerDAO = {} as CustomerDAO;
        let stats: CustomerStatsDAO[] = this.customerStats;
        let newStat: CustomerStatsDAO = {} as CustomerStatsDAO;

        let idTemplate: string = "CNR";
        let fullID: string;
        let idQuestion: Answers<string> = await Console.question("Pick three numbers for the id: ", "number");
        
        if (this.checkExistenceAndCharacters(idQuestion.value) == true) {
            fullID  = idTemplate + idQuestion.value;
            newCustomer.id = fullID;
        } else {
            this.showCustomerOptions();
            return;
        }
        
        let lastNameQuestion: Answers<string> = await Console.question("Last Name: ", "text");
        newCustomer.last_name = lastNameQuestion.value;

        let firstNameQuestion: Answers<string> = await Console.question("First Name: ", "text");
        newCustomer.first_name = firstNameQuestion.value;

        let streetNumberAddressQuestion: Answers<string> = await Console.question("Street/House Number: ", "text");
        newCustomer.street_number_address = streetNumberAddressQuestion.value;

        let postalCodeQuestion: Answers<string> = await Console.question("Postal Code: ", "number");
        newCustomer.postal_code = postalCodeQuestion.value;

        let cityQuestion: Answers<string> = await Console.question("City: ", "text");
        newCustomer.city = cityQuestion.value;

        let discountPercentageQuestion: Answers<string> = await Console.question("Discount percentage: ", "number");
        newCustomer.discount_percentage = discountPercentageQuestion.value;

        allCustomers.push(newCustomer);
        FileHandler.writeFile("./../../data/customers.json", allCustomers);

        newStat.customer = newCustomer; 
        stats.push(newStat);
        FileHandler.writeFile("./../../data/customersStatistics.json", stats);

        Console.printLine("--Your customers has been created.")
        this.showCustomerOptions();
    }

    // lets you edit a customer and replaces the old with the new information in the json

    public async editCustomer(selectedCustomer: number): Promise<void> {
        Console.printLine("--Please follow the steps to edit the customer--");
        let allCustomers: CustomerDAO[] = this.customers;
        let stats: CustomerStatsDAO[] = this.customerStats;

        let idTemplate: string = "CNR";
        let fullID: string;
        let idQuestion: Answers<string> = await Console.question("Pick three new numbers to replace '" + allCustomers[selectedCustomer].id + "': ", "number");

        if (this.checkExistenceAndCharacters(idQuestion.value) == true) {
            fullID  = idTemplate + idQuestion.value;
            allCustomers[selectedCustomer].id = fullID;
        } else {
            this.handleSelectedCustomer(selectedCustomer);
            return;
        }

        let lastNameQuestion: Answers<string> = await Console.question("Replace Last Name '" + allCustomers[selectedCustomer].last_name + "': ", "text");
        allCustomers[selectedCustomer].last_name = lastNameQuestion.value;

        let firstNameQuestion: Answers<string> = await Console.question("Replace First Name '" + allCustomers[selectedCustomer].first_name + "': ", "text");
        allCustomers[selectedCustomer].first_name = firstNameQuestion.value;

        let streetNumberAddressQuestion: Answers<string> = await Console.question("Replace Street/Number '" + allCustomers[selectedCustomer].street_number_address + "': ", "text");
        allCustomers[selectedCustomer].street_number_address = streetNumberAddressQuestion.value;

        let postalCodeQuestion: Answers<string> = await Console.question("Replace Postal code '" + allCustomers[selectedCustomer].postal_code + "': ", "number");
        allCustomers[selectedCustomer].postal_code = postalCodeQuestion.value;

        let cityQuestion: Answers<string> = await Console.question("Replace City '" + allCustomers[selectedCustomer].city + "': ", "text");
        allCustomers[selectedCustomer].city = cityQuestion.value;

        let discountPercentageQuestion: Answers<string> = await Console.question("Replace Discount Percentage '" + allCustomers[selectedCustomer].discount_percentage + "': ", "number");
        allCustomers[selectedCustomer].discount_percentage = discountPercentageQuestion.value;

        FileHandler.writeFile("./../../data/customers.json", allCustomers);

        stats[selectedCustomer].customer = allCustomers[selectedCustomer]; 
        FileHandler.writeFile("./../../data/customersStatistics.json", stats);

        Console.printLine("--Your customer has been edited.")
        this.showCustomerOptions();
    }

    // checks if the new id is already in use or allowed with only three numbers

    public checkExistenceAndCharacters(id: string): boolean {
        let regexp: RegExp = new RegExp('^[0-9]{3}$');
        let exists: Boolean = false;

        if (regexp.test(id) == true) {

            for (let i: number = 0; i < this.customers.length; i++) {
                if ( this.customers[i].id == "CNR" + id) {
                    exists = true;
                }
            }

            if (exists == true) {
                Console.printLine("--The ID is already taken!--")
                return false;
            } else {
                Console.printLine("--The ID is available!--")
                return true;
            }

        } else {
            Console.printLine("--The ID contains unallowed characters. Try again!--")
            return false;
        }

    }

}
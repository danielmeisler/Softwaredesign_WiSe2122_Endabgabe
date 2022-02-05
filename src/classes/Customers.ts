import { Answers } from 'prompts';
import { CustomerDAO } from './dao/customerDao';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Customers {
    
    constructor() {}

    public customers: CustomerDAO[] = FileHandler.readArrayFile("./../../data/customers.json");

    public async showCustomerOptions(): Promise<void> {

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
            case 3:
                this.createNewCustomer();   
            default:
                break;
        }
    }

    public async handleSelectedCustomer(selectedCustomer: number): Promise<void> {

        let answer: Answers<string> = await Console.showOptions(
            [
              "1. Edit customer",
              "2. Delete customer",
              "3. Show statistics",
              "4. Make an order"
            ],
            "What do you want to do with [" + this.customers[selectedCustomer].id + "] " + this.customers[selectedCustomer].last_name + ", " + this.customers[selectedCustomer].first_name + "?");

          switch (answer.value) {
            case 1:
                this.editCustomer(selectedCustomer);
                break;
            case 2:
                FileHandler.deleteFile("./../../data/customers.json", selectedCustomer);
                break;
            case 3:
                
                break;
            case 4:

                break;
            default:
                break;
        }
    }

    public async createNewCustomer(): Promise<void> {
        Console.printLine("--Please follow the steps to create a new customer--");
        let allCustomers: CustomerDAO[] = this.customers;
        let newCustomer: CustomerDAO = {} as CustomerDAO;

        let idTemplate: string = "CNR";
        let idQuestion: Answers<string> = await Console.question("Pick three numbers for the id: ", "number");
        let fullID: string = idTemplate + idQuestion.value;
        
        newCustomer.id = fullID;

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
    }

    public async editCustomer(selectedCustomer: number): Promise<void> {
        Console.printLine("--Please follow the steps to edit the customer--");
        let allCustomers: CustomerDAO[] = this.customers;

        let idTemplate: string = "CNR";
        let idQuestion: Answers<string> = await Console.question("Pick three new numbers to replace '" + allCustomers[selectedCustomer].id + "': ", "number");
        let fullID: string = idTemplate + idQuestion.value;

        allCustomers[selectedCustomer].id = fullID;

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
    }


}
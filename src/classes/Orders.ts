import { Answers } from 'prompts';
import { App } from '../App';
import { ArticleDAO } from './dao/articleDao';
import { CustomerDAO } from './dao/customerDao';
import { OrderDAO } from './dao/orderDao';
import { ArticleStatsDAO, CustomerStatsDAO } from './dao/statisticDao';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Orders {
    
    constructor() {}

    public orders: OrderDAO[] = FileHandler.readArrayFile("./../../data/orders.json");
    public articles: ArticleDAO[] = FileHandler.readArrayFile("./../../data/articles.json");
    public customers: CustomerDAO[] = FileHandler.readArrayFile("./../../data/customers.json");
    public articleStats: ArticleStatsDAO[] = FileHandler.readArrayFile("./../../data/articlesStatistics.json");
    public customerStats: CustomerStatsDAO[] = FileHandler.readArrayFile("./../../data/customersStatistics.json");

    // shows order menu

    public async showOrderOptions(): Promise<void> {

        let answer: Answers<string> = await Console.showOptions(
            [
                "1. Search an order",
                "2. Show list of orders",
                "3. Create a new order",
                "4. [<-] Go back"
            ],
            "Orders: What do you want to do?");
      
          this.handleOrderAnswer(answer.value);
    }

    // processes the input and lets you search for an order or create one

    public async handleOrderAnswer(answer: number): Promise<void> {
        let orderArray: string[] = [];

        switch (answer) {
            case 1:
                let orderSearch: Answers<string> = await Console.question("Search by ID or customer", "text");
                for (let i: number = 0; i < this.orders.length; i++) {
                    if (this.orders[i].id.includes(orderSearch.value) || this.orders[i].order_date.toString().includes(orderSearch.value) || this.orders[i].customer.last_name.toString().includes(orderSearch.value) || this.orders[i].customer.first_name.toString().includes(orderSearch.value)) {
                        orderArray.push("["+ this.orders[i].id + "] " + this.orders[i].order_date + " - " + this.orders[i].customer.last_name + ", " + this.orders[i].customer.first_name);
                    } else {
                        Console.printLine("--Sorry, your input was not found. Please try again--")
                        this.showOrderOptions();
                    }
                }
                let foundOrder: Answers<string> = await Console.showOptions(orderArray,"All found orders: ");
                this.handleSelectedOrder(foundOrder.value - 1);
                break;

            case 2:
                this.orders = FileHandler.readArrayFile("./../../data/orders.json");
                for (let i: number = 0; i < this.orders.length; i++) {
                    orderArray.push("["+ this.orders[i].id + "] " + this.orders[i].order_date + " - " + this.orders[i].customer.last_name + ", " + this.orders[i].customer.first_name);
                }
                let selectedOrder: Answers<string> = await Console.showOptions(orderArray,"All available orders: ");
                this.handleSelectedOrder(selectedOrder.value - 1);
                break;

            case 3:
                this.createNewOrder();
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

    // if you search or display the orders you can edit or delete it.

    public async handleSelectedOrder(selectedOrder: number): Promise<void> {

        let answer: Answers<string> = await Console.showOptions(
            [
              "1. Edit order",
              "2. Delete order",
              "3. [<-] Go back"
            ],
            "What do you want to do with [" + this.orders[selectedOrder].id + "] " + this.orders[selectedOrder].order_date + " - " + this.orders[selectedOrder].customer.last_name + ", " + this.orders[selectedOrder].customer.first_name);
      
            switch (answer.value) {
                case 1:
                    this.editOrder(selectedOrder);
                    break;
                case 2:
                    Console.printLine(selectedOrder + "")
                    FileHandler.deleteFile("./../../data/orders.json", selectedOrder);
                    Console.printLine("--Order succesfully deleted--")
                    
                    this.showOrderOptions();
                    break;
                case 3:
                    this.showOrderOptions();
                default:
                    Console.printLine("Option not available!");
                    break;
            } 
    }

    // creates an order and asks you every needed information to put it in a json and statistics

    public async createNewOrder(): Promise<void> {
        Console.printLine("--Please follow the steps to create a new order--");
        let allOrders: OrderDAO[] = this.orders;
        let newOrder: OrderDAO = {} as OrderDAO;
        let articleStats: ArticleStatsDAO[] = this.articleStats;
        let customerStats: CustomerStatsDAO[] = this.customerStats;
        let newCustomerStat: CustomerStatsDAO = {} as CustomerStatsDAO;

        let idTemplate: string = "ONR";
        let fullID: string;
        let idQuestion: Answers<string> = await Console.question("Pick three numbers for the id: ", "number");
        
        if (this.checkExistenceAndCharacters(idQuestion.value) == true) {
            fullID  = idTemplate + idQuestion.value;
            newOrder.id = fullID;
        } else {
            this.showOrderOptions();
            return;
        }

        let customerArray: string[] = [];
        for (let i: number = 0; i < this.customers.length; i++) {
            customerArray.push("["+ this.customers[i].id + "] " + this.customers[i].last_name + ", " + this.customers[i].first_name);
        }
        let customerQuestion: Answers<string> = await Console.showOptions(customerArray,"Order for: ");
        customerQuestion.value = customerQuestion.value - 1;
        newOrder.customer = this.customers[customerQuestion.value];
        newCustomerStat.customer = this.customers[customerQuestion.value];

        let articleArray: string[] = [];
        for (let i: number = 0; i < this.articles.length; i++) {
            articleArray.push("["+ this.articles[i].id + "] " + this.articles[i].description + "; " + this.articles[i].standard_delivery_time + " days.");
        }
        let articleQuestion: Answers<string> = await Console.showOptions(articleArray,"Order what: ");
        articleQuestion.value = articleQuestion.value - 1;
        newOrder.article = this.articles[articleQuestion.value]; 

        Console.printLine("Minimum [" + this.articles[articleQuestion.value].min_order_quantity + "] and Maximum [" + this.articles[articleQuestion.value].max_order_quantity + "] order quantity.");
        let quantityQuestion: Answers<string> = await Console.question("How many: ", "number");
        if(quantityQuestion.value >= this.articles[articleQuestion.value].min_order_quantity && quantityQuestion.value <= this.articles[articleQuestion.value].max_order_quantity) {
            newOrder.quantity = quantityQuestion.value;
            articleStats[articleQuestion.value].quantity += quantityQuestion.value;
            newCustomerStat.quantities = quantityQuestion.value;
        } else {
            Console.printLine("Sorry your input was out of range. Try again!");
            this.showOrderOptions();
            return;
        }

        Console.printLine("Launch date: " + this.articles[articleQuestion.value].launch_date)
        let orderDateQuestion: Answers<string> = await Console.question("Order date: ", "date");
        let orderDay: number = new Date(orderDateQuestion.value).getDate();
        let orderMonth: number = new Date(orderDateQuestion.value).getMonth() + 1;
        let orderYear: number = new Date(orderDateQuestion.value).getFullYear();

        newOrder.order_date = orderDateQuestion.value;
        
        let deliveryDate: number = orderDay + this.articles[articleQuestion.value].standard_delivery_time;

        if (deliveryDate > 30) {
            orderMonth++;
        }
        if (orderMonth > 12) {
            orderYear++;
        }

        // tried to calculate the date type, but i couldn't get it to work

        /*if(orderDateQuestion.value >= this.articles[articleQuestion.value].launch_date) {
            newOrder.order_date = orderDateQuestion.value;
        } else {
            Console.printLine("Sorry your order date is before launch date. Try again!");
            this.showOrderOptions();
            return;
        } */

        let fullDate: string = deliveryDate +"-"+ orderMonth +"-"+ orderYear;
        Console.printLine(fullDate);
        Console.printLine("Your order will arrive on " + fullDate);
        newOrder.delivery_date = fullDate;

        let sum: number = quantityQuestion.value * this.articles[articleQuestion.value].price_euro;
        if (quantityQuestion.value >= this.articles[articleQuestion.value].discount_quantity) {
            let percentValue: number = this.articles[articleQuestion.value].discount_percentage / 100;
            let discount: number = sum * percentValue;
            sum = sum - discount;
        }

        let percentValue: number = this.customers[customerQuestion.value].discount_percentage / 100;
        let discount: number = sum * percentValue;
        sum = sum - discount;
        Console.printLine("Your total is " + sum + "???");
        newOrder.total = sum;

        articleStats[articleQuestion.value].orders++;
        articleStats[articleQuestion.value].sales += sum;
        let averageSales: number = articleStats[articleQuestion.value].sales/articleStats[articleQuestion.value].quantity;
        articleStats[articleQuestion.value].averageSalesPerArticle = averageSales;

        newCustomerStat.articles = [];
        newCustomerStat.articles.push(this.articles[articleQuestion.value]);

        newCustomerStat.sales += sum;
        customerStats.push(newCustomerStat);

        FileHandler.writeFile("./../../data/articlesStatistics.json", articleStats);
        FileHandler.writeFile("./../../data/customersStatistics.json", customerStats);
        allOrders.push(newOrder);

        FileHandler.writeFile("./../../data/orders.json", allOrders);

        Console.printLine("--Your order has been created.")
        this.showOrderOptions();
    }

    // lets you edit an order and replaces the old with the new information in the json and the statistics

    public async editOrder(selectedOrder: number): Promise<void> {
        Console.printLine("--Please follow the steps to edit an order--");
        let allOrders: OrderDAO[] = this.orders;
        let articleStats: ArticleStatsDAO[] = this.articleStats;
        let customerStats: CustomerStatsDAO[] = this.customerStats;

        let idTemplate: string = "ONR";
        let fullID: string;
        let idQuestion: Answers<string> = await Console.question("Pick three new numbers to replace '" + allOrders[selectedOrder].id + "': ", "number");
        
        if (this.checkExistenceAndCharacters(idQuestion.value) == true) {
            fullID  = idTemplate + idQuestion.value;
            allOrders[selectedOrder].id = fullID;
        } else {
            this.handleSelectedOrder(selectedOrder);
            return;
        }

        let customerArray: string[] = [];
        for (let i: number = 0; i < this.customers.length; i++) {
            customerArray.push("["+ this.customers[i].id + "] " + this.customers[i].last_name + ", " + this.customers[i].first_name);
        }
        let customerQuestion: Answers<string> = await Console.showOptions(customerArray,"Order for instead for "+ allOrders[selectedOrder].customer.last_name + ", " + allOrders[selectedOrder].customer.first_name + ": ");
        customerQuestion.value = customerQuestion.value - 1;
        allOrders[selectedOrder].customer = this.customers[customerQuestion.value];

        let articleArray: string[] = [];
        for (let i: number = 0; i < this.articles.length; i++) {
            articleArray.push("["+ this.articles[i].id + "] " + this.articles[i].description + "; " + this.articles[i].standard_delivery_time + " days.");
        }
        let articleQuestion: Answers<string> = await Console.showOptions(articleArray,"Order what: ");
        articleQuestion.value = articleQuestion.value - 1;
        allOrders[selectedOrder].article = this.articles[articleQuestion.value]; 

        Console.printLine("Minimum [" + this.articles[articleQuestion.value].min_order_quantity + "] and Maximum [" + this.articles[articleQuestion.value].max_order_quantity + "] order quantity.");
        let quantityQuestion: Answers<string> = await Console.question("How many: ", "number");
        if(quantityQuestion.value >= this.articles[articleQuestion.value].min_order_quantity && quantityQuestion.value <= this.articles[articleQuestion.value].max_order_quantity) {
            allOrders[selectedOrder].quantity = quantityQuestion.value;
            articleStats[articleQuestion.value].quantity += quantityQuestion.value;
            customerStats[selectedOrder].quantities = quantityQuestion.value;
        } else {
            Console.printLine("Sorry your input was out of range. Try again!");
            this.showOrderOptions();
            return;
        }

        Console.printLine("Launch date: " + this.articles[articleQuestion.value].launch_date)
        let orderDateQuestion: Answers<string> = await Console.question("Order date: ", "date");
        let orderDay: number = new Date(orderDateQuestion.value).getDate();
        let orderMonth: number = new Date(orderDateQuestion.value).getMonth() + 1;
        let orderYear: number = new Date(orderDateQuestion.value).getFullYear();

        allOrders[selectedOrder].order_date = orderDateQuestion.value;
        
        let deliveryDate: number = orderDay + this.articles[articleQuestion.value].standard_delivery_time;

        if (deliveryDate > 30) {
            orderMonth++;
        }
        if (orderMonth > 12) {
            orderYear++;
        }

        // same as above: tried to calculate the date type, but i couldn't get it to work

/*         if(orderDateQuestion.value >= this.articles[articleQuestion.value].launch_date) {
            newOrder.order_date = orderDateQuestion.value;
        } else {
            Console.printLine("Sorry your order date is before launch date. Try again!");
            this.showOrderOptions();
            return;
        } */

        let fullDate: string = deliveryDate +"-"+ orderMonth +"-"+ orderYear;
        Console.printLine(fullDate);
        Console.printLine("Your order will arrive on " + fullDate);
        allOrders[selectedOrder].delivery_date = fullDate;

        let sum: number = quantityQuestion.value * this.articles[articleQuestion.value].price_euro;
        if (quantityQuestion.value >= this.articles[articleQuestion.value].discount_quantity) {
            let percentValue: number = this.articles[articleQuestion.value].discount_percentage / 100;
            let discount: number = sum * percentValue;
            sum = sum - discount;
        }

        let percentValue: number = this.customers[customerQuestion.value].discount_percentage / 100;
        let discount: number = sum * percentValue;
        sum = sum - discount;
        Console.printLine("Your total is " + sum + "???");
        allOrders[selectedOrder].total = sum;

        articleStats[articleQuestion.value].orders++;
        articleStats[articleQuestion.value].sales += sum;
        let averageSales: number = articleStats[articleQuestion.value].sales/articleStats[articleQuestion.value].quantity;
        articleStats[articleQuestion.value].averageSalesPerArticle = averageSales;

        customerStats[selectedOrder].articles = [];
        customerStats[selectedOrder].customer = this.customers[customerQuestion.value];
        customerStats[selectedOrder].articles.push(this.articles[articleQuestion.value]);

        customerStats[selectedOrder].sales += sum;

        FileHandler.writeFile("./../../data/articlesStatistics.json", articleStats);
        FileHandler.writeFile("./../../data/customersStatistics.json", customerStats);

        FileHandler.writeFile("./../../data/orders.json", allOrders);

        Console.printLine("--Your order has been edited--")
        this.showOrderOptions();
    }

    // checks if the new id is already in use or allowed with only three numbers

    public checkExistenceAndCharacters(id: string): boolean {
        let regexp: RegExp = new RegExp('^[0-9]{3}$');
        let exists: Boolean = false;

        if (regexp.test(id) == true) {

            for (let i: number = 0; i < this.orders.length; i++) {
                if ( this.orders[i].id == "ONR" + id) {
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
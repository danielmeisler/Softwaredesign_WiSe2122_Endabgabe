import { Answers } from 'prompts';
import { Articles } from './classes/Articles';
import { Customers } from './classes/Customers';
import { UserDAO } from './classes/dao/userDao';
import { Orders } from './classes/Orders';
import { Users } from './classes/Users';
import Console from "./classes/singletons/Console";

export class App {

    constructor() {}

    public async showHome(currentUser: UserDAO): Promise<void> {
        Console.printLine("--Homepage: Welcome " + currentUser.username + "!--");
        let answer: Answers<string>;

        if (currentUser.admin == true) {
            answer = await Console.showOptions(
                [
                  "1. Articles",
                  "2. Customers",
                  "3. Orders",
                  "4. [ADMIN] Users"
                ],
                "Which section do you want to edit?");
        } else {
            answer = await Console.showOptions(
                [
                  "1. Articles",
                  "2. Customers",
                  "3. Orders"
                ],
                "Which section do you want to edit?");
        }
        this.handleAnswer(answer.value, currentUser);
    }

    public async handleAnswer(answer: number, currentUser: UserDAO): Promise<void> {
        switch (answer) {
            case 1:
                let articles: Articles = new Articles();
                articles.showArticleOptions(currentUser);
                break;
            case 2:
                let customers: Customers = new Customers();
                customers.showCustomerOptions();
                break;
            case 3:
                let orders: Orders = new Orders();
                orders.showOrderOptions();
                break;
            case 4:
                let users: Users = new Users();
                users.showUserOptions();
                break;
            default:
                break;
        }
    }
}

export default App;
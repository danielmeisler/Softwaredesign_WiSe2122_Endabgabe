import App from "./App";
import Console from "./classes/singletons/Console";
import FileHandler from './classes/singletons/FileHandler';
import { UserDAO } from "./classes/dao/userDao";
import { Answers } from 'prompts';

export class Login {

    public async showLogin(): Promise<void> {
        Console.printLine("Login");
        let usernameQuestion: Answers<string> = await Console.question("Username: ", "text");
        let passwordQuestion: Answers<string> = await Console.question("Password: ", "password");

        this.handleUser(usernameQuestion.value, passwordQuestion.value);
    }

    public async handleUser(username: string, password: string): Promise<void> {
        let users: UserDAO[] = await FileHandler.readArrayFile("./../../data/users.json");
        let succes: Boolean = false;
        let currentUser: UserDAO = users[0];

        for (let i: number = 0; i < users.length; i++) {
          	if ( users[i].username == username && users[i].password == password) {
              	currentUser = users[i];
                succes = true;
          	}
        }

        if (succes == true) {
          	Console.printLine("You have successfully logged in!")
          	let app: App = new App();
          	app.showHome(currentUser);
        } else {
          	Console.printLine("Your login was incorrect, please try again!")
          	this.showLogin();
        }
    }

}

export default Login;
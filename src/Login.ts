import Console from "./classes/singletons/Console";
import FileHandler from './classes/singletons/FileHandler';
import { Answers } from 'prompts';
import { App } from "./App";
import { UserDAO } from "./classes/dao/userDao";

// function to check if the user is already created and in the json, if so then save it in the global variable.

export let currentUser: UserDAO = {} as UserDAO;

export class Login {

    public async showLogin(): Promise<void> {
        Console.printLine("--Login--");
        let usernameQuestion: Answers<string> = await Console.question("Username: ", "text");
        let passwordQuestion: Answers<string> = await Console.question("Password: ", "password");

        this.handleUser(usernameQuestion.value, passwordQuestion.value);
    }

    public async handleUser(username: string, password: string): Promise<void> {
        let users: UserDAO[] = await FileHandler.readArrayFile("./../../data/users.json");
        let succes: Boolean = false;

        for (let i: number = 0; i < users.length; i++) {
          	if ( users[i].username == username && users[i].password == password) {
              	currentUser = users[i];
                succes = true;
          	}
        }

        if (succes == true) {
          	Console.printLine("--You have successfully logged in!--")
          	let app: App = new App();
          	app.showHome();
        } else {
          	Console.printLine("--Your login was incorrect, please try again!--")
          	this.showLogin();
        }
    }

}

export default Login;
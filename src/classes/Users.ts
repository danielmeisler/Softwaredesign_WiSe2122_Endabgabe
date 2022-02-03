import { Answers } from 'prompts';
import { UserDAO } from './dao/userDao';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Users {
    
    constructor() {}

    public users: UserDAO[] = FileHandler.readArrayFile("./../../data/users.json");

    public async showUserOptions(): Promise<void> {
        Console.printLine("User Page");

        let answer: Answers<string> = await Console.showOptions(
            [
                "1. Search an user",
                "2. Show list of users",
                "3. Create a new user"
            ],
            "Users: What do you want to do?");
      
          this.handleUserAnswer(answer.value);
    }

    public async handleUserAnswer(answer: number): Promise<void> {

        let userArray: string[] = [];

        switch (answer) {
            case 1:

                let userSearch: Answers<string> = await Console.question("Search by username", "text");

                for (let i: number = 0; i < this.users.length; i++) {
                    if (this.users[i].username.includes(userSearch.value)) {
                        userArray.push(this.users[i].username.toString());
                    }
                }

                let foundUser: Answers<string> = await Console.showOptions(userArray,"All found users: ");
                this.handleSelectedUser(foundUser.value - 1);

                break;
            case 2:

                for (let i: number = 0; i < this.users.length; i++) {
                    userArray.push(this.users[i].username.toString());
                }

                let selectedUser: Answers<string> = await Console.showOptions(userArray,"All available users: ");
                this.handleSelectedUser(selectedUser.value - 1);
                
                break;
            default:
                Console.printLine("Option not available!");
                break;
        }
    }

    public async handleSelectedUser(selectedUser: number): Promise<void> {

        let answer: Answers<string> = await Console.showOptions(
            [
              "1. Edit username",
              "2. Edit password",
              "3. Edit admin rights"
            ],
            "What do you want to do with " + this.users[selectedUser].username + "?");
      
          //this.handleSelecteduserAnswer(answer.value);   
    }
}
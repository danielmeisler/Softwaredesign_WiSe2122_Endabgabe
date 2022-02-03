import { Answers } from 'prompts';
import { UserDAO } from './dao/userDao';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Users {
    
    constructor() {}

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

        let users: UserDAO[] = await FileHandler.readArrayFile("./../../data/users.json");

        switch (answer) {
            case 1:
                let userSearch: Answers<string> = await Console.question("Search by username", "text");

                for (let i: number = 0; i < users.length; i++) {
                    if (users[i].username.includes(userSearch.value)) {
                        await Console.showOptions([users[i].username.toString()],"All found users: ");
                        this.handleSelectedUser(users[i]);
                    }
                }
                break;
            case 2:


                    await Console.showOptions(["["+ users.toString() + "] " + users],"All available users: ");
                break;
            default:
                Console.printLine("Option not available!");
                break;
        }
    }

    public async handleSelectedUser(selectedUser: UserDAO): Promise<void> {
        Console.printLine("What do you want to do with "+ selectedUser.username + " ?");

        let answer: Answers<string> = await Console.showOptions(
            [
              "1. Edit username",
              "2. Edit password",
              "3. Edit admin rights"
            ],
            "What do you want to do with the selected user?");
      
          //this.handleSelecteduserAnswer(answer.value);   
    }
}
import { Answers } from 'prompts';
import { UserDAO } from './dao/userDao';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Users {
    
    constructor() {}

    public users: UserDAO[] = FileHandler.readArrayFile("./../../data/users.json");

    public async showUserOptions(): Promise<void> {

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
            case 3:

                this.createNewUser();

                break;
            default:
                break;
        }
    }

    public async handleSelectedUser(selectedUser: number): Promise<void> {

        let answer: Answers<string> = await Console.showOptions(
            [
              "1. Edit user",
              "2. Delete user"
            ],
            "What do you want to do with " + this.users[selectedUser].username + "?");
      
            switch (answer.value) {
                case 1:
                    this.editUser(selectedUser);
                    break;
                case 2:
                    if (selectedUser < 0) {
                        FileHandler.deleteFile("./../../data/users.json", selectedUser);
                    } else {
                        Console.printLine("Sorry, you can not delete the super admin.")
                    }
                    break;
                default:
                    break;
            }
    }

    public async createNewUser(): Promise<void> {
        Console.printLine("--Please follow the steps to create a new user--");
        let allUsers: UserDAO[] = this.users;
        let newUser: UserDAO = {} as UserDAO;

        let usernameQuestion: Answers<string> = await Console.question("Username: ", "text");
        if (await this.checkExistence(usernameQuestion.value) == true) {
            newUser.username = usernameQuestion.value;
        } else {
            Console.printLine("--This username already exists, please try another.--");
            this.createNewUser();
        }

        let passwordQuestion: Answers<string> = await Console.question("Password: ", "text");
        newUser.password = passwordQuestion.value;

        let adminQuestion: Answers<string> = await Console.question("Admin rights: ", "toggle");
        newUser.admin = adminQuestion.value;

        allUsers.push(newUser);

        FileHandler.writeFile("./../../data/users.json", allUsers);
    }

    public async editUser(selectedUser: number): Promise<void> {
        Console.printLine("--Please follow the steps to edit the user--");
        let allUsers: UserDAO[] = this.users;

        let usernameQuestion: Answers<string> = await Console.question("Change username '"+ allUsers[selectedUser].username +"' to:", "text");
        if (await this.checkExistence(usernameQuestion.value) == true) {
            allUsers[selectedUser].username = usernameQuestion.value;
        } else {
            Console.printLine("--This username already exists, please try another.--");
            this.editUser(selectedUser);
        }

        let passwordQuestion: Answers<string> = await Console.question("Change password: ", "password");
        allUsers[selectedUser].password = passwordQuestion.value;

        let adminQuestion: Answers<string> = await Console.question("Change admin right from '" + allUsers[selectedUser].admin + "' to: ", "toggle");
        allUsers[selectedUser].admin = adminQuestion.value;

        FileHandler.writeFile("./../../data/users.json", allUsers);
    }

    public async checkExistence(user: string): Promise<boolean> {



        return true;
    }
}
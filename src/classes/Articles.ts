import { Answers } from 'prompts';
import { ArticleDAO } from './dao/articleDao';
import { UserDAO } from './dao/userDao';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Articles {
    
    constructor() {}

    public articles: ArticleDAO[] = FileHandler.readArrayFile("./../../data/articles.json");

    public async showArticleOptions(currentUser: UserDAO): Promise<void> {
        let answer: Answers<string>;

        if (currentUser.admin == true) {
            answer = await Console.showOptions(
                [
                    "1. Search an article",
                    "2. Show list of articles",
                    "3. [ADMIN] Create a new article."
                ],
                "Articles: What do you want to do?");
        } else {
            answer = await Console.showOptions(
                [
                    "1. Search an article",
                    "2. Show list of articles"
                ],
                "Articles: What do you want to do?");
          
        }
        this.handleArticleAnswer(answer.value, currentUser);
    }

    public async handleArticleAnswer(answer: number, currentUser: UserDAO): Promise<void> {

        let articleArray: string[] = [];

        switch (answer) {
            case 1:

                let articleSearch: Answers<string> = await Console.question("Search by ID or description", "text");

                for (let i: number = 0; i < this.articles.length; i++) {
                    if (this.articles[i].id.includes(articleSearch.value) || this.articles[i].description.includes(articleSearch.value)) {
                        articleArray.push("["+ this.articles[i].id + "] " + this.articles[i].description);
                    }
                }

                let foundArticle: Answers<string> = await Console.showOptions(articleArray,"All found articles: ");
                this.handleSelectedArticle(foundArticle.value - 1, currentUser);

                break;
            case 2:

                for (let i: number = 0; i < this.articles.length; i++) {
                    articleArray.push("["+ this.articles[i].id + "] " + this.articles[i].description);
                }

                let selectedArticle: Answers<string> = await Console.showOptions(articleArray,"All available articles: ");
                this.handleSelectedArticle(selectedArticle.value - 1, currentUser);
                break;
            case 3:
                this.createNewArticle(currentUser);
                break;
            default:
                break;
        }
    }

    public async handleSelectedArticle(selectedArticle: number, currentUser: UserDAO): Promise<void> {
        let answer: Answers<string>;

        if (currentUser.admin == true) { 
            answer = await Console.showOptions(
                [
                  "1. Edit article",
                  "2. Show statistics",
                  "3. Make an order",
                  "4. [ADMIN] Delete article."
                ],
                "What do you want to do with [" + this.articles[selectedArticle].id + "] " + this.articles[selectedArticle].description + "?");
        } else {
            answer = await Console.showOptions(
                [
                  "1. Edit article",
                  "2. Show statistics",
                  "3. Make an order"
                ],
                "What do you want to do with [" + this.articles[selectedArticle].id + "] " + this.articles[selectedArticle].description + "?");
        }
        
        switch (answer.value) {
            case 1:
                this.editArticle(selectedArticle, currentUser);
                break;
            case 2:
                
                break;
            case 3:
                
                break;
            case 4:
                FileHandler.deleteFile("./../../data/articles.json", selectedArticle);
                Console.printLine("--Article succesfully deleted--")
                break;
            default:
                break;
        }

    }

    public async createNewArticle(currentUser: UserDAO): Promise<void> {
        Console.printLine("--Please follow the steps to create a new article--");
        let allArticles: ArticleDAO[] = this.articles;
        let newArticle: ArticleDAO = {} as ArticleDAO;

        let idTemplate: string = "ABC";
        let fullID: string;
        let idQuestion: Answers<string> = await Console.question("Pick three numbers for the id: ", "number");

        if (this.checkExistenceAndCharacters(idQuestion.value) == true) {
            fullID  = idTemplate + idQuestion.value;
            newArticle.id = fullID;
        } else {
            this.showArticleOptions(currentUser);
            return;
        }

        let descriptionQuestion: Answers<string> = await Console.question("Description: ", "text");
        newArticle.description = descriptionQuestion.value;

        let launchDateQuestion: Answers<string> = await Console.question("Launch date: ", "date");
        newArticle.launch_date = launchDateQuestion.value;

        let priceEuroQuestion: Answers<string> = await Console.question("Price in Euro: ", "number");
        newArticle.price_euro = priceEuroQuestion.value;

        let standardDeliveryTimeQuestion: Answers<string> = await Console.question("Standard delivery time: ", "number");
        newArticle.standard_delivery_time = standardDeliveryTimeQuestion.value;

        let minOrderQuantityQuestion: Answers<string> = await Console.question("Minimum order quantity: ", "number");
        newArticle.min_order_quantity = minOrderQuantityQuestion.value;

        let maxOrderQuantityQuestion: Answers<string> = await Console.question("Maximum order quantity: ", "number");
        newArticle.max_order_quantity = maxOrderQuantityQuestion.value;

        let discountQuantityQuestion: Answers<string> = await Console.question("You get discount with a minimum order of: ", "number");
        newArticle.discount_quantity = discountQuantityQuestion.value;

        let discountPercentageQuestion: Answers<string> = await Console.question("Discount percentage: ", "number");
        newArticle.discount_percentage = discountPercentageQuestion.value;

        allArticles.push(newArticle);

        FileHandler.writeFile("./../../data/articles.json", allArticles);
    }

    public async editArticle(selectedArticle: number, currentUser: UserDAO): Promise<void> {
        Console.printLine("--Please follow the steps to edit the article--");
        let allArticles: ArticleDAO[] = this.articles;

        let idTemplate: string = "ABC";
        let fullID: string;
        let idQuestion: Answers<string> = await Console.question("Replace id '" + allArticles[selectedArticle].id + "' with three new numbers:", "number");

        if (this.checkExistenceAndCharacters(idQuestion.value) == true) {
            fullID  = idTemplate + idQuestion.value;
            allArticles[selectedArticle].id = fullID;
        } else {
            this.handleSelectedArticle(selectedArticle, currentUser);
            return;
        }

        let descriptionQuestion: Answers<string> = await Console.question("Replace description '" + allArticles[selectedArticle].description + "':", "text");
        allArticles[selectedArticle].description = descriptionQuestion.value;

        let launchDateQuestion: Answers<string> = await Console.question("Replace launch date '" + allArticles[selectedArticle].launch_date + "':", "date");
        allArticles[selectedArticle].launch_date = launchDateQuestion.value;

        let priceEuroQuestion: Answers<string> = await Console.question("Replace price in euro '" + allArticles[selectedArticle].price_euro + "':", "number");
        allArticles[selectedArticle].price_euro = priceEuroQuestion.value;

        let standardDeliveryTimeQuestion: Answers<string> = await Console.question("Replace standard delivery time '" + allArticles[selectedArticle].standard_delivery_time + "':", "number");
        allArticles[selectedArticle].standard_delivery_time = standardDeliveryTimeQuestion.value;

        let minOrderQuantityQuestion: Answers<string> = await Console.question("Replace minimum order quantity '" + allArticles[selectedArticle].min_order_quantity + "':", "number");
        allArticles[selectedArticle].min_order_quantity = minOrderQuantityQuestion.value;

        let maxOrderQuantityQuestion: Answers<string> = await Console.question("Replace maximum order quantity '" + allArticles[selectedArticle].max_order_quantity + "':", "number");
        allArticles[selectedArticle].max_order_quantity = maxOrderQuantityQuestion.value;

        let discountQuantityQuestion: Answers<string> = await Console.question("Replace quantity discount '" + allArticles[selectedArticle].discount_quantity + "':", "number");
        allArticles[selectedArticle].discount_quantity = discountQuantityQuestion.value;

        let discountPercentageQuestion: Answers<string> = await Console.question("Replace discount in percentage '" + allArticles[selectedArticle].discount_percentage + "':", "number");
        allArticles[selectedArticle].discount_percentage = discountPercentageQuestion.value;

        FileHandler.writeFile("./../../data/articles.json", allArticles);
    }

    public checkExistenceAndCharacters(id: string): boolean {
        let regexp: RegExp = new RegExp('^[0-9]{3}$');
        let exists: Boolean = false;

        if (regexp.test(id) == true) {

            for (let i: number = 0; i < this.articles.length; i++) {
                if ( this.articles[i].id == "ABC" + id) {
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
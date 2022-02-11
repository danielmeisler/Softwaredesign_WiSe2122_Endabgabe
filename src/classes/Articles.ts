import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';
import { Answers } from 'prompts';
import { ArticleDAO } from './dao/articleDao';
import { ArticleStatsDAO } from './dao/statisticDao';
import { Statistics } from './Statistics';
import { Orders } from './Orders';
import { currentUser } from '../Login';
import { App } from '../App';

export class Articles {
    
    constructor() {}

    public articles: ArticleDAO[] = FileHandler.readArrayFile("./../../data/articles.json");
    public articleStats: ArticleStatsDAO[] = FileHandler.readArrayFile("./../../data/articlesStatistics.json");

    // shows article menu

    public async showArticleOptions(): Promise<void> {
        let answer: Answers<string>;

        if (currentUser.admin == true) {
            answer = await Console.showOptions(
                [
                    "1. [<-] Go back",
                    "2. Search an article",
                    "3. Show list of articles",
                    "4. [ADMIN] Create a new article."
                ],
                "Articles: What do you want to do?");
        } else {
            answer = await Console.showOptions(
                [
                    "1. [<-] Go back",
                    "2. Search an article",
                    "3. Show list of articles"
                ],
                "Articles: What do you want to do?");
        }
        this.handleArticleAnswer(answer.value);
    }

    // processes the input and lets you search for an article or create one

    public async handleArticleAnswer(answer: number): Promise<void> {
        let articleArray: string[] = [];

        switch (answer) {
            case 1:
                let app: App = new App();
                app.showHome();
                break;

            case 2:
                this.articles = FileHandler.readArrayFile("./../../data/articles.json");
                let articleSearch: Answers<string> = await Console.question("Search by ID or description", "text");
                for (let i: number = 0; i < this.articles.length; i++) {
                    if (this.articles[i].id.includes(articleSearch.value) || this.articles[i].description.includes(articleSearch.value)) {
                        articleArray.push("["+ this.articles[i].id + "] " + this.articles[i].description);
                    } else {
                        Console.printLine("--Sorry, your input was not found. Please try again--")
                        this.showArticleOptions();
                        return;
                    }
                }
                let foundArticle: Answers<string> = await Console.showOptions(articleArray,"All found articles: ");
                this.handleSelectedArticle(foundArticle.value - 1);
                break;

            case 3:
                for (let i: number = 0; i < this.articles.length; i++) {
                    articleArray.push("["+ this.articles[i].id + "] " + this.articles[i].description);
                }
                let selectedArticle: Answers<string> = await Console.showOptions(articleArray,"All available articles: ");
                this.handleSelectedArticle(selectedArticle.value - 1);
                break;

            case 4:
                this.createNewArticle();
                break;

            default:
                Console.printLine("Option not available!");
                break;
        }

    }

    // if you search or display the articles you can edit, look up the statistics or make an order. As an admin you can even delete the article.

    public async handleSelectedArticle(selectedArticle: number): Promise<void> {
        let answer: Answers<string>;

        if (currentUser.admin == true) { 
            answer = await Console.showOptions(
                [
                    "1. [<-] Go back",
                    "2. Edit article",
                    "3. Show statistics",
                    "4. Make an order",
                    "5. [ADMIN] Delete article."
                ],
                "What do you want to do with [" + this.articles[selectedArticle].id + "] " + this.articles[selectedArticle].description + "?");
        } else {
            answer = await Console.showOptions(
                [
                    "1. [<-] Go back",
                    "2. Edit article",
                    "3. Show statistics",
                    "4. Make an order"
                ],
                "What do you want to do with [" + this.articles[selectedArticle].id + "] " + this.articles[selectedArticle].description + "?");
        }
        
        switch (answer.value) {
            case 1:
                this.showArticleOptions();
                break;

            case 2:
                this.editArticle(selectedArticle);
                break;

            case 3:
                let statistics: Statistics = new Statistics();
                statistics.showArticleStatistics(selectedArticle);
                break;

            case 4:
                let order: Orders = new Orders();
                order.showOrderOptions();
                break;

            case 5:
                FileHandler.deleteFile("./../../data/articles.json", selectedArticle);
                FileHandler.deleteFile("./../../data/articlesStatistics.json", selectedArticle);
                Console.printLine("--Article succesfully deleted--");
                this.showArticleOptions();
                break;

            default:
                Console.printLine("Option not available!");
                break;
        }
    }

    // creates an article and asks you every needed information to put it in a json

    public async createNewArticle(): Promise<void> {
        Console.printLine("--Please follow the steps to create a new article--");
        let allArticles: ArticleDAO[] = this.articles;
        let newArticle: ArticleDAO = {} as ArticleDAO;
        let stats: ArticleStatsDAO[] = this.articleStats;
        let newStat: ArticleStatsDAO = {} as ArticleStatsDAO;

        let idTemplate: string = "ABC";
        let fullID: string;
        let idQuestion: Answers<string> = await Console.question("Pick three numbers for the id: ", "number");

        if (this.checkExistenceAndCharacters(idQuestion.value) == true) {
            fullID  = idTemplate + idQuestion.value;
            newArticle.id = fullID;
        } else {
            this.showArticleOptions();
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

        newStat.article = newArticle; 
        stats.push(newStat);
        FileHandler.writeFile("./../../data/articlesStatistics.json", stats);
        
        Console.printLine("--Your article has been created.")
        this.showArticleOptions();
    }

    // lets you edit an article and replaces the old with the new information in the json

    public async editArticle(selectedArticle: number): Promise<void> {
        Console.printLine("--Please follow the steps to edit the article--");
        let allArticles: ArticleDAO[] = this.articles;
        let stats: ArticleStatsDAO[] = this.articleStats;

        let idTemplate: string = "ABC";
        let fullID: string;
        let idQuestion: Answers<string> = await Console.question("Replace id '" + allArticles[selectedArticle].id + "' with three new numbers:", "number");

        if (this.checkExistenceAndCharacters(idQuestion.value) == true) {
            fullID  = idTemplate + idQuestion.value;
            allArticles[selectedArticle].id = fullID;
        } else {
            this.handleSelectedArticle(selectedArticle);
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

        stats[selectedArticle].article = allArticles[selectedArticle]; 
        FileHandler.writeFile("./../../data/articlesStatistics.json", stats);

        Console.printLine("--Your article has been edited.")
        this.showArticleOptions();
    }

    // checks if the new id is already in use or allowed with only three numbers

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
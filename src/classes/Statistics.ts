import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';
import { Answers } from 'prompts';
import { App } from '../App';
import { ArticleStatsDAO, CustomerStatsDAO } from './dao/statisticDao';

export class Statistics {

    constructor() {}
    public articleStats: ArticleStatsDAO[] = FileHandler.readArrayFile("./../../data/articlesStatistics.json");
    public customerStats: CustomerStatsDAO[] = FileHandler.readArrayFile("./../../data/customersStatistics.json");

    // shows the statistics of an article from a json

    public async showArticleStatistics(currentArticle: number): Promise<void> {
        Console.printLine("--Statistics of [" + this.articleStats[currentArticle].article.id + "] " + this.articleStats[currentArticle].article.description);
        Console.printLine("Sold pieces: " + this.articleStats[currentArticle].quantity + " pieces");
        Console.printLine("Number of orders: " + this.articleStats[currentArticle].orders);
        Console.printLine("Sales: " + this.articleStats[currentArticle].sales + "€");
        Console.printLine("Average sales per article: " + this.articleStats[currentArticle].averageSalesPerArticle + "€");
        this.goBack();
    }

    // shows the statistics of a customer from a json

    public async showCustomerStatistics(currentCustomer: number): Promise<void> {
        Console.printLine("--Statistics of ["+ this.customerStats[currentCustomer].customer.id + "] " + this.customerStats[currentCustomer].customer.last_name + ", " + this.customerStats[currentCustomer].customer.first_name);
        Console.printLine("Sales: " + this.customerStats[currentCustomer].sales + "€");
        for(let i: number = 0; i < this.customerStats[currentCustomer].articles.length; i++) {
            Console.printLine("Article: " + this.customerStats[currentCustomer].articles[i].description + "; " + this.customerStats[currentCustomer].quantities[i] + " pieces");
        }
        this.goBack();
    }

    // asks you if you want to go back to main menu

    public async goBack(): Promise<void> {
        let goBackQuestion: Answers<string> = await Console.question("Do you want to return?", "confirm");
         if (goBackQuestion.value == true) {
            let app: App = new App();
            app.showHome();
        }
    }

}
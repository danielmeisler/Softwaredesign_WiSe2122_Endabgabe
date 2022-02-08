import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';
import { ArticleDAO } from './dao/articleDao';
import { CustomerDAO } from './dao/customerDao';
import { ArticleStatsDAO, CustomerStatsDAO } from './dao/statisticDao';

export class Statistics {

    constructor() {}
    public articleStats: ArticleStatsDAO[] = FileHandler.readArrayFile("./../../data/articlesStatistics.json");
    public customerStats: CustomerStatsDAO[] = FileHandler.readArrayFile("./../../data/customersStatistics.json");

    public async showArticleStatistics(currentArticle: number): Promise<void> {
        Console.printLine("--Statistics of [" + this.articleStats[currentArticle].article.id + "] " + this.articleStats[currentArticle].article.description);
        Console.printLine("Sold pieces: " + this.articleStats[currentArticle].quantity + " pieces");
        Console.printLine("Number of orders: " + this.articleStats[currentArticle].orders);
        Console.printLine("Sales: " + this.articleStats[currentArticle].sales + "€");
        Console.printLine("Average sales per article: " + this.articleStats[currentArticle].averageSalesPerArticle + "€");
    }

    public async showCustomerStatistics(currentCustomer: number): Promise<void> {
        Console.printLine("--Statistics of ["+ this.customerStats[currentCustomer].customer.id + "] " + this.customerStats[currentCustomer].customer.last_name + ", " + this.customerStats[currentCustomer].customer.first_name);
        Console.printLine("Sales: " + this.customerStats[currentCustomer].sales + "€");
        for(let i: number = 0; i < this.customerStats.length; i++) {
            Console.printLine("Article: " + this.customerStats[currentCustomer].articles + "; " + this.customerStats[currentCustomer].quantities + " pieces");
        }
    }

}
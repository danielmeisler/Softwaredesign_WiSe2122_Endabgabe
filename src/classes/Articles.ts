import { Answers } from 'prompts';
import { ArticleDAO } from './dao/articleDao';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Articles {
    
    constructor() {}

    public articles: ArticleDAO[] = FileHandler.readArrayFile("./../../data/articles.json");

    public async showArticleOptions(): Promise<void> {
        Console.printLine("Article Page");

        let answer: Answers<string> = await Console.showOptions(
            [
                "1. Search an article",
                "2. Show list of articles"
            ],
            "Articles: What do you want to do?");
      
          this.handleArticleAnswer(answer.value);
    }

    public async handleArticleAnswer(answer: number): Promise<void> {

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
                this.handleSelectedArticle(foundArticle.value - 1);

                break;
            case 2:

                for (let i: number = 0; i < this.articles.length; i++) {
                    articleArray.push("["+ this.articles[i].id + "] " + this.articles[i].description);
                }

                let selectedArticle: Answers<string> = await Console.showOptions(articleArray,"All available articles: ");
                this.handleSelectedArticle(selectedArticle.value - 1);

                break;
            default:
                Console.printLine("Option not available!");
                break;
        }
    }

    public async handleSelectedArticle(selectedArticle: number): Promise<void> {
        await Console.showOptions(
            [
              "1. Edit article",
              "2. Show statistics",
              "3. Make an order"
            ],
            "What do you want to do with [" + this.articles[selectedArticle].id + "] " + this.articles[selectedArticle].description + "?");
      
          //this.handleSelectedArticleAnswer(answer.value);
    }
}
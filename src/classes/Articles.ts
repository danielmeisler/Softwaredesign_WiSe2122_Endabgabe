import { Answers } from 'prompts';
import { ArticleDAO } from './dao/articleDao';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class Articles {
    
    constructor() {}

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

        let articles: ArticleDAO[] = await FileHandler.readArrayFile("./../../data/articles.json");


        switch (answer) {
            case 1:
                let articleSearch: Answers<string> = await Console.question("Search by ID or description", "text");

                for (let i: number = 0; i < articles.length; i++) {
                    if (articles[i].id.includes(articleSearch.value) || articles[i].description.includes(articleSearch.value)) {
                        await Console.showOptions(["["+ articles[i].id.toString() + "] " + articles[i].description.toString()],"All found articles: ");
                        this.handleSelectedArticle(articles[i]);
                    }
                }
                break;
            case 2:

                for (let i: number = 0; i < articles.length; i++) {
                    Console.printLine(i + " " + articles.length);
                    await Console.showOptions(["["+ articles[i].id + "] " + articles[i].description],"All available articles: ");
                }

                break;
            default:
                Console.printLine("Option not available!");
                break;
        }
    }

    public async handleSelectedArticle(selectedArticle: ArticleDAO): Promise<void> {
        Console.printLine("What do you want to do with [" + selectedArticle.id + "] " + selectedArticle.description + " ?");

        let answer: Answers<string> = await Console.showOptions(
            [
              "1. Edit article",
              "2. Show statistics",
              "3. Make an order"
            ],
            "What do you want to do with the selected Article?");
      
          //this.handleSelectedArticleAnswer(answer.value);   
    }
}
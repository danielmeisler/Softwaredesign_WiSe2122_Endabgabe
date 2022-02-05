"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Articles = void 0;
const Console_1 = __importDefault(require("./singletons/Console"));
const FileHandler_1 = __importDefault(require("./singletons/FileHandler"));
class Articles {
    constructor() {
        this.articles = FileHandler_1.default.readArrayFile("./../../data/articles.json");
    }
    showArticleOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            let answer = yield Console_1.default.showOptions([
                "1. Search an article",
                "2. Show list of articles"
            ], "Articles: What do you want to do?");
            this.handleArticleAnswer(answer.value);
        });
    }
    handleArticleAnswer(answer) {
        return __awaiter(this, void 0, void 0, function* () {
            let articleArray = [];
            switch (answer) {
                case 1:
                    let articleSearch = yield Console_1.default.question("Search by ID or description", "text");
                    for (let i = 0; i < this.articles.length; i++) {
                        if (this.articles[i].id.includes(articleSearch.value) || this.articles[i].description.includes(articleSearch.value)) {
                            articleArray.push("[" + this.articles[i].id + "] " + this.articles[i].description);
                        }
                    }
                    let foundArticle = yield Console_1.default.showOptions(articleArray, "All found articles: ");
                    this.handleSelectedArticle(foundArticle.value - 1);
                    break;
                case 2:
                    for (let i = 0; i < this.articles.length; i++) {
                        articleArray.push("[" + this.articles[i].id + "] " + this.articles[i].description);
                    }
                    let selectedArticle = yield Console_1.default.showOptions(articleArray, "All available articles: ");
                    this.handleSelectedArticle(selectedArticle.value - 1);
                    break;
                default:
                    break;
            }
        });
    }
    handleSelectedArticle(selectedArticle) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Console_1.default.showOptions([
                "1. Edit article",
                "2. Show statistics",
                "3. Make an order"
            ], "What do you want to do with [" + this.articles[selectedArticle].id + "] " + this.articles[selectedArticle].description + "?");
            //this.handleSelectedArticleAnswer(answer.value);
        });
    }
}
exports.Articles = Articles;
//# sourceMappingURL=Articles.js.map
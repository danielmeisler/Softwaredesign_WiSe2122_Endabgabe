import { ArticleDAO } from './articleDao';
import { CustomerDAO } from './customerDao';

export interface ArticleStatsDAO {
    article: ArticleDAO,
    quantity: number,
    orders: number,
    sales: number,
    averageSalesPerArticle: number
}

export interface CustomerStatsDAO {
    customer: CustomerDAO;
    articles: ArticleDAO[],
    quantities: number[],
    sales: number,
}


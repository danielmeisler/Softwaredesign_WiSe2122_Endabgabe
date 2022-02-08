import { ArticleDAO } from './articleDao';
import { CustomerDAO } from './customerDao';

export interface OrderDAO {
    id: String,
    order_date: String,
    delivery_date: String,
    total: number,
    customer: CustomerDAO,
    article: ArticleDAO,
    quantity: number
}
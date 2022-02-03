import { CustomerDAO } from './customerDao';

export interface OrderDAO {
    id: String,
    order_date: String,
    delivery_date: String,
    total: Number,
    customer: CustomerDAO
}
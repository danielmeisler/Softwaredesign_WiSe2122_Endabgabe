export interface ArticleDAO {
    id: String,
    description: String,
    launch_date: String,
    price_euro: number,
    standard_delivery_time: number,
    min_order_quantity: number,
    max_order_quantity: number,
    discount_quantity: number,
    discount_percentage: number
}
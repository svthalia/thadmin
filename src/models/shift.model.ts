import Product from "@/models/product.model";

export default interface Shift {
  pk: number;
  start_date: string;
  end_date: string;
  products: [Product];
  total_revenue: number;
  num_orders: number;
  orders: string;
}

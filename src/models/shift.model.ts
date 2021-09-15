import Product from "@/models/product.model";

export default interface Shift {
  pk: number;
  title: string;
  locked: boolean;
  active: boolean;
  start: string;
  end: string;
  products: Product[];
  total_revenue: number;
  num_orders: number;
  product_sales: Record<string, number>;
}

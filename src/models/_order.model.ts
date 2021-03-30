import OrderItem from "@/models/orderitem.model";

// eslint-disable-next-line @typescript-eslint/class-name-casing
interface _Order {
  pk: string;
  shift: string | null;
  created_at: string;
  order_items: [OrderItem] | null;
  order_description: string | null;
  age_restricted: boolean | null;
  total_amount: number | null;
  discount: number | null;
  payment_amount: number;
  payment: string | null;
  payment_url: string | null;
  payer: string | null;
  details: string | null;
}

export default _Order;

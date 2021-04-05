import OrderItem from "@/models/orderitem.model";

// eslint-disable-next-line @typescript-eslint/class-name-casing
interface _Order {
  pk: string;
  shift: string | null;
  created_at: string;
  order_items: [OrderItem] | null;
  order_description: string | null;
  age_restricted: boolean | null;
  subtotal: number | null;
  discount: number | null;
  total_amount: number | null;
  num_items: number | null;
  payment: Payment | null;
  payer: Member | null;
  payment_url: string | null;
}

export default _Order;

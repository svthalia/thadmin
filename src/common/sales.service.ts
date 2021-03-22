import ApiService from "@/common/api.service";
import { AxiosResponse } from "axios";

interface Product {
  name: string;
  price: number;
  age_restricted: boolean;
}

interface Shift {
  pk: number;
  start_date: string;
  end_date: string;
  products: [Product];
  total_revenue: number;
  num_orders: number;
  orders: string;
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: [T];
}

interface Order {
  pk: string;
  shift: string | null;
  created_at: string;
  order_items: [Product] | null;
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

class SalesService {
  apiService = ApiService;

  async getShift(shift: number): Promise<Shift> {
    const result: AxiosResponse<Shift> = await this.apiService.get(
      `/sales/${shift}/`
    );
    return result.data;
  }

  async getOrders(shift: number): Promise<[Order]> {
    const result: AxiosResponse<Paginated<Order>> = await this.apiService.get(
      `/sales/${shift}/orders/`
    );
    return result.data.results;
  }

  async getOrderDetails(pk: string): Promise<Order> {
    const result: AxiosResponse<Order> = await this.apiService.get(
      `/sales/order/${pk}/`
    );
    return result.data;
  }

  async newOrder(shift: number): Promise<Order> {
    const result: AxiosResponse<Order> = await this.apiService.post(
        `/sales/${shift}/orders/`, {}
    );
    return result.data;
  }

}

export default SalesService;

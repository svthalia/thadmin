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

interface OrderItem {
  product: string;
  amount: number;
  total: number | null;
}

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

class Order {
  _o: _Order;

  constructor(order: _Order) {
    this._o = order;
  }

  getOrderItem(product: Product) {
    if (this._o.order_items == null) {
      return null;
    }
    const item = this._o.order_items.filter(
      item => item.product == product.name
    )[0];
    if (item == undefined) {
      return null;
    }
    return item;
  }

  plusProduct(product: Product) {
    if (this._o.order_items == null) {
      const orderItem = {
        product: product.name,
        amount: 1,
        total: product.price
      };
      // eslint-disable-next-line @typescript-eslint/camelcase
      this._o.order_items = [orderItem];
    } else {
      let orderItem = this.getOrderItem(product);
      if (orderItem == null) {
        orderItem = {
          product: product.name,
          amount: 1,
          total: product.price
        };
        this._o.order_items.push(orderItem);
      } else {
        orderItem.amount++;
        orderItem.total = product.price * orderItem.amount;
      }
    }
  }

  minusProduct(product: Product) {
    if (this._o.order_items == null) {
      console.log("Deleting a non-existent product");
    } else {
      const orderItem = this.getOrderItem(product);
      if (orderItem == null) {
        console.log("Deleting a non-existent product");
      } else {
        orderItem.amount--;
        if (orderItem.amount == 0) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/camelcase
          this._o.order_items = this._o.order_items.filter(
            item => item.product !== product.name
          );
        }
        orderItem.total = product.price * orderItem.amount;
      }
    }
  }

  deleteProduct(product: Product) {
    if (this._o.order_items == null) {
      console.log("Deleting a non-existent product");
    } else {
      const orderItem = this.getOrderItem(product);
      if (orderItem == null) {
        console.log("Deleting a non-existent product");
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/camelcase
        this._o.order_items = this._o.order_items.filter(
          item => item.product !== product.name
        );
      }
    }
  }

  productAmount(product: Product) {
    if (this._o.order_items == null) {
      console.log("This product does not exist");
    } else {
      const orderItem = this.getOrderItem(product);
      if (orderItem == null) {
        return 0;
      }
      return orderItem.amount;
    }
  }
}

class SalesService {
  apiService = ApiService;

  async getShift(shift: number): Promise<Shift> {
    const result: AxiosResponse<Shift> = await this.apiService.get(
      `/sales/${shift}/`
    );
    return result.data;
  }

  async getOrderDetails(pk: string): Promise<Order> {
    const result: AxiosResponse<_Order> = await this.apiService.get(
      `/sales/order/${pk}/`
    );
    return new Order(result.data);
  }

  async updateOrder(order: Order): Promise<Order> {
    const result: AxiosResponse<_Order> = await this.apiService.put(
      `/sales/order/${order._o.pk}/`,
      order._o
    );
    order._o = result.data;
    return order;
  }

  async newOrder(shift: number, order: Order | null = null): Promise<Order> {
    let data: {};
    if (order == null) {
      data = {};
    } else {
      data = order._o;
    }
    const result: AxiosResponse<_Order> = await this.apiService.post(
      `/sales/${shift}/orders/`,
      data
    );
    return new Order(result.data);
  }
}

export default SalesService;

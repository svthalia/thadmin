import ApiService from "@/common/api.service";
import { AxiosResponse } from "axios";
import Paginated from "@/models/paginated.model";
import Shift from "@/models/shift.model";
import Order from "@/models/order.model";
import Member from "@/models/member.model";
import Payable from "@/models/payable.model";
import OrderItem from "@/models/orderitem.model";

class SalesService {
  apiService = ApiService;

  async getShifts(): Promise<Shift[]> {
    const result: AxiosResponse<Paginated<Shift>> = await this.apiService.get(
      `/admin/sales/shifts/`
    );
    return result.data.results;
  }

  async getShift(shift: number): Promise<Shift> {
    const result: AxiosResponse<Shift> = await this.apiService.get(
      `/admin/sales/shifts/${shift}/`
    );
    return result.data;
  }

  async newOrder(shift: number, order: Order | null = null): Promise<Order> {
    const data: { order_items: OrderItem[] } = order?.getAPIData() ?? {
      order_items: [],
    };
    const result: AxiosResponse = await this.apiService.post(
      `/admin/sales/shifts/${shift}/orders/`,
      data
    );
    const parsedData = {
      ...result.data,
      subtotal: parseFloat(result.data.subtotal),
      total_amount: parseFloat(result.data.total_amount),
      discount: parseFloat(result.data.discount),
      order_items: result.data.order_items.map((i: { total: string }) => ({
        ...i,
        total: parseFloat(i.total),
      })),
    };
    if (order !== null) {
      order.updateFromAPI(parsedData);
      return order;
    }
    return Order.orderFromAPI(parsedData);
  }

  async updateOrder(order: Order, shift: number | null = null): Promise<Order> {
    if (order._o === null && shift !== null) {
      order = await this.newOrder(shift, order);
      return order;
    }
    const result: AxiosResponse = await this.apiService.put(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      `/admin/sales/orders/${order._o.pk}/`,
      // eslint-disable-next-line @typescript-eslint/ban-types
      order.getAPIData() as {}
    );
    const parsedData = {
      ...result.data,
      subtotal: parseFloat(result.data.subtotal),
      total_amount: parseFloat(result.data.total_amount),
      discount: parseFloat(result.data.discount),
      order_items: result.data.order_items.map((i: { total: string }) => ({
        ...i,
        total: parseFloat(i.total),
      })),
    };
    order.updateFromAPI(parsedData);
    return order;
  }

  async getOrderDetails(order: Order): Promise<Order> {
    const result: AxiosResponse = await this.apiService.get(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      `/admin/sales/orders/${order._o.pk}/`
    );
    const parsedData = {
      ...result.data,
      subtotal: parseFloat(result.data.subtotal),
      total_amount: parseFloat(result.data.total_amount),
      discount: parseFloat(result.data.discount),
      order_items: result.data.order_items.map((i: { total: string }) => ({
        ...i,
        total: parseFloat(i.total),
      })),
    };
    if (order.synced) {
      order.updateFromAPI(parsedData);
    }
    return order;
  }

  async deleteOrder(order: Order) {
    if (order._o === null) {
      return;
    }
    return await this.apiService.delete(`/admin/sales/orders/${order._o.pk}/`);
  }

  async getAuthorizedUserData(): Promise<Member> {
    const result: AxiosResponse<Member> = await this.apiService.get(
      `/members/me/`
    );
    return result.data;
  }

  async createPayment(order: Order, paymentType: string) {
    if (order._o === null) {
      return;
    }
    const result: AxiosResponse<Payable> = await this.apiService.patch(
      `/admin/payments/payables/sales/order/${order._o.pk}/`,
      { payment_type: paymentType + "_payment" }
    );
    return result.data;
  }
}

export default SalesService;

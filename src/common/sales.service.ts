import ApiService from "@/common/api.service";
import { AxiosResponse } from "axios";
import Paginated from "@/models/paginated.model";
import Shift from "@/models/shift.model";
import Order from "@/models/order.model";
import _Order from "@/models/_order.model";
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
    let data: { order_items: OrderItem[] };
    if (order === null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data = {};
    } else {
      data = order.getAPIData();
    }
    const result: AxiosResponse<_Order> = await this.apiService.post(
      `/admin/sales/shifts/${shift}/orders/`,
      data
    ); // TODO this endpoint does not accept all fields, so items are set to 0
    if (order !== null) {
      order.updateFromAPI(result.data);
      return order;
    }
    return Order.orderFromAPI(result.data);
  }

  async updateOrder(order: Order, shift: number | null = null): Promise<Order> {
    if (order._o === null && shift !== null) {
      order = await this.newOrder(shift, order);
    }
    const result: AxiosResponse<_Order> = await this.apiService.put(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      `/admin/sales/orders/${order._o.pk}/`,
      // eslint-disable-next-line @typescript-eslint/ban-types
      order.getAPIData() as {}
    );
    order.updateFromAPI(result.data);
    return order;
  }

  async getOrderDetails(order: Order): Promise<Order> {
    const result: AxiosResponse<_Order> = await this.apiService.get(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      `/admin/sales/orders/${order._o.pk}/`
    );
    if (order.synced) {
      order.updateFromAPI(result.data);
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

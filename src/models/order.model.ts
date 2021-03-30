import Product from "@/models/product.model";
import OrderItem from "@/models/orderitem.model";
import _Order from "@/models/_order.model";

class Order {
  items: [OrderItem] | null;
  synced: boolean;
  _o: _Order | null;

  constructor() {
    this.items = null;
    this.synced = false;
    this._o = null;
  }

  public getPK() {
    if (this._o?.pk) {
      return this._o.pk;
    }
    return null;
  }

  public getDescription() {
    if (this._o?.order_description) {
      return this._o.order_description;
    }
    return null;
  }

  public getAmount() {
    if (this._o?.payment_amount) {
      return this._o.payment_amount;
    }
    return null;
  }

  public getPaymentUrl() {
    if (this._o?.payment_url) {
      return this._o.payment_url;
    }
    return "https://www.youtube.com/watch?v=V4MF2s6MLxY";
  }

  public isPaid() {
    return !!this._o?.payment;
  }

  public getOrderItem(product: Product): OrderItem | null {
    if (this.items == null) {
      return null;
    }
    const item = this.items.filter(item => item.product == product.name)[0];
    if (item == undefined) {
      return null;
    }
    return item;
  }

  public plusProduct(product: Product): void {
    this.synced = false;
    if (this.items == null) {
      const orderItem = {
        product: product.name,
        amount: 1,
        total: product.price
      };
      // eslint-disable-next-line @typescript-eslint/camelcase
      this.items = [orderItem];
    } else {
      let orderItem = this.getOrderItem(product);
      if (orderItem == null) {
        orderItem = {
          product: product.name,
          amount: 1,
          total: product.price
        };
        this.items.push(orderItem);
      } else {
        orderItem.amount++;
        orderItem.total = product.price * orderItem.amount;
      }
    }
  }

  public minusProduct(product: Product): void {
    if (this.items != null) {
      const orderItem = this.getOrderItem(product);
      if (orderItem != null) {
        this.synced = false;
        orderItem.amount--;
        if (orderItem.amount == 0) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/camelcase
          this.items = this.items.filter(item => item.product !== product.name);
        }
        orderItem.total = product.price * orderItem.amount;
      }
    }
  }

  public deleteProduct(product: Product): void {
    if (this.items != null) {
      const orderItem = this.getOrderItem(product);
      if (orderItem != null) {
        this.synced = false;
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.items = this.items.filter(item => item.product !== product.name);
      }
    }
  }

  public productAmount(product: Product): number {
    if (this.items == null) {
      return 0;
    } else {
      const orderItem = this.getOrderItem(product);
      if (orderItem == null) {
        return 0;
      }
      return orderItem.amount;
    }
  }

  public updateFromAPI(o: _Order) {
    this.synced = true;
    this._o = o;
    this.items = o.order_items;
  }

  public getAPIData(): { order_items: [OrderItem] | null } {
    // eslint-disable-next-line @typescript-eslint/camelcase
    return { order_items: this.items };
  }

  static orderFromAPI(o: _Order) {
    const order: Order = new Order();
    order._o = o;
    return order;
  }
}

export default Order;

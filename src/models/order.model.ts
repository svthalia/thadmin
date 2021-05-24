import Product from "@/models/product.model";
import OrderItem from "@/models/orderitem.model";
import _Order from "@/models/_order.model";

class Order {
  items: [OrderItem] | null;
  synced: boolean;
  _o: _Order | null;
  ageCheckPerformed: boolean;

  constructor() {
    this.items = null;
    this.synced = false;
    this._o = null;
    this.ageCheckPerformed = false;
  }

  public getPK(): string | null {
    if (this._o?.pk) {
      return this._o.pk;
    }
    return null;
  }

  public getDescription(): string | null {
    if (this._o?.order_description) {
      return this._o.order_description;
    }
    return null;
  }

  public getAmount(): null | number {
    if (this._o?.total_amount) {
      return this._o.total_amount;
    }
    return null;
  }

  public getPaymentUrl(): string {
    if (this._o?.payment_url) {
      return this._o.payment_url;
    }
    return "#";
  }

  public isAgeRestricted(): boolean {
    return this._o?.age_restricted === true;
  }

  public isPaid(): boolean {
    return !!this._o?.payment;
  }

  public needsPayment(): boolean {
    return this.getAmount() !== 0;
  }

  public hasPayer(): boolean {
    return !!this._o?.payer;
  }

  public getPayer(): string | null {
    if (this._o?.payer?.profile.display_name) {
      return this._o?.payer?.profile.display_name;
    }
    return null;
  }

  public getPayerImage(): string | null {
    if (this._o?.payer?.profile.photo.medium) {
      return this._o?.payer?.profile.photo.medium;
    }
    return null;
  }

  public payerIsAdult(): boolean {
    if (this._o?.payer && this._o?.payer.profile.birthday) {
      const birthDate = new Date(this._o?.payer.profile.birthday);
      const date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      return birthDate <= date;
    }
    return true;
  }

  public hasProducts(): boolean {
    return this.items !== null && this.items.length > 0;
  }

  public getOrderItem(product: Product): OrderItem | null {
    if (this.items === null) {
      return null;
    }
    const item: OrderItem | undefined = this.items.filter(
      item => item.product === product.name
    )[0];
    if (item === undefined) {
      return null;
    }
    return item;
  }

  public plusProduct(product: Product): void {
    this.synced = false;
    if (this.items === null) {
      const orderItem = {
        product: product.name,
        amount: 1,
        total: product.price
      };
      // eslint-disable-next-line @typescript-eslint/camelcase
      this.items = [orderItem];
    } else {
      let orderItem = this.getOrderItem(product);
      if (orderItem === null) {
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
    if (this.items !== null) {
      const orderItem = this.getOrderItem(product);
      if (orderItem !== null) {
        this.synced = false;
        orderItem.amount--;
        if (orderItem.amount === 0) {
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
    if (this.items !== null) {
      const orderItem = this.getOrderItem(product);
      if (orderItem !== null) {
        this.synced = false;
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.items = this.items.filter(item => item.product !== product.name);
      }
    }
  }

  public productAmount(product: Product): number {
    if (this.items === null) {
      return 0;
    } else {
      const orderItem = this.getOrderItem(product);
      if (orderItem === null) {
        return 0;
      }
      return orderItem.amount;
    }
  }

  public updateFromAPI(o: _Order): void {
    this.synced = true;
    this._o = o;
    this.items = o.order_items;
  }

  public getAPIData(): {} {
    const data = this.items;
    if (data !== null) {
      data.forEach(i => delete i.total);
    }
    // eslint-disable-next-line @typescript-eslint/camelcase
    return { order_items: data };
  }

  static orderFromAPI(o: _Order): Order {
    const order: Order = new Order();
    order._o = o;
    return order;
  }
}

export default Order;

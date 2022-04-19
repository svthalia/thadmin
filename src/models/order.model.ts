import Product from "@/models/product.model";
import OrderItem from "@/models/orderitem.model";
import _Order from "@/models/_order.model";
import { min } from "@popperjs/core/lib/utils/math";

class Order {
  items: OrderItem[] | null;
  synced: boolean;
  _o: _Order | null;
  ageCheckPerformed: boolean;
  discount: null | number;

  constructor() {
    this.items = null;
    this.synced = false;
    this._o = null;
    this.ageCheckPerformed = false;
    this.discount = null;
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
    return this.getAmount() != 0;
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

  public getSubtotal(): null | number {
    if (this._o?.subtotal) {
      return this._o.subtotal;
    }
    return null;
  }

  public addDiscount(amount: number) {
    if (this.getSubtotal() === null) {
      return;
    }
    this.synced = false;
    if (this.discount === null) {
      this.discount = parseFloat(String(amount));
    } else {
      this.discount =
        parseFloat(String(this.discount)) + parseFloat(String(amount));
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (this.getSubtotal() < this.discount) {
      this.discount = this.getSubtotal();
    }
  }

  public removeDiscount(amount: number) {
    this.synced = false;
    if (this.discount === null || this.discount < amount) {
      this.discount = 0;
    } else {
      this.discount -= parseFloat(String(amount));
    }
  }

  public updateDiscount() {
    this.discount = min(this.getSubtotal() || 0, this.discount || 0);
    if (this.discount == 0) {
      this.discount = null;
    }
  }

  public getOrderItem(product: Product): OrderItem | null {
    if (this.items === null) {
      return null;
    }
    const item: OrderItem | undefined = this.items.filter(
      (item) => item.product === product.name
    )[0];
    if (item === undefined) {
      return null;
    }
    return item;
  }

  public plusProduct(product: Product, amount = 1): void {
    this.synced = false;
    if (this.items === null) {
      const orderItem = {
        product: product.name,
        amount: amount,
        total: product.price * amount,
      };
      this.items = [orderItem];
    } else {
      let orderItem = this.getOrderItem(product);
      if (orderItem === null) {
        orderItem = {
          product: product.name,
          amount: amount,
          total: product.price * amount,
        };
        this.items.push(orderItem);
      } else {
        orderItem.amount += amount;
        orderItem.total = product.price * orderItem.amount;
      }
    }
    this.updateDiscount();
  }

  public minusProduct(product: Product): void {
    if (this.items !== null) {
      const orderItem = this.getOrderItem(product);
      if (orderItem !== null) {
        this.synced = false;
        orderItem.amount--;
        if (orderItem.amount === 0) {
          this.items = this.items.filter(
            (item) => item.product !== product.name
          );
        }
        orderItem.total = product.price * orderItem.amount;
      }
    }
    this.updateDiscount();
  }

  public deleteProduct(product: Product): void {
    if (this.items !== null) {
      const orderItem = this.getOrderItem(product);
      if (orderItem !== null) {
        this.synced = false;
        this.items = this.items.filter((item) => item.product !== product.name);
      }
    }
    this.updateDiscount();
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
    this.discount = o.discount;

    if (this.hasPayer() && this.payerIsAdult()) {
      this.ageCheckPerformed = true;
    }
    this.updateDiscount();
  }

  public getAPIData():
    | { order_items: OrderItem[]; discount: null | number }
    | { order_items: OrderItem[] } {
    let data = this.items;
    if (data !== null) {
      data.forEach((i) => delete i.total);
    }
    if (data === null) {
      data = [];
    }
    if (this.discount !== null) {
      return { order_items: data, discount: this.discount };
    }
    return { order_items: data };
  }

  static orderFromAPI(o: _Order): Order {
    const order: Order = new Order();
    order._o = o;
    return order;
  }
}

export default Order;

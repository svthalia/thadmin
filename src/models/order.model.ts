import Product from "@/models/product.model";
import OrderItem from "@/models/orderitem.model";
import _Order from "@/models/_order.model";

class Order {
  items: OrderItem[] | null;
  synced: boolean;
  _o: _Order | null;
  ageCheckPerformed: boolean;
  // Unit prices of products added locally, so the total can be shown
  // instantly without waiting for the server.
  prices: Record<string, number>;
  // Incremented on every local change, used to detect changes made while a
  // request to the server is in flight.
  localVersion: number;

  constructor() {
    this.items = null;
    this.synced = false;
    this._o = null;
    this.ageCheckPerformed = false;
    this.prices = {};
    this.localVersion = 0;
  }

  public getPK(): string | null {
    if (this._o?.pk) {
      return this._o.pk;
    }
    return null;
  }

  public getDescription(): string | null {
    if (this.synced && this._o?.order_description) {
      return this._o.order_description;
    }
    if (this.items) {
      return this.items.map((i) => i.amount + "x" + " " + i.product).join(",");
    }
    return null;
  }

  public getAmount(): null | number {
    if (this.synced && this._o?.total_amount) {
      return Number(this._o.total_amount);
    }
    if (this.items) {
      return this.items.reduce((partialSum, i) => {
        const price = this.prices[i.product];
        if (price !== undefined) return partialSum + price * i.amount;
        return partialSum + Number(i.total ?? 0);
      }, 0);
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
    if (this.items == null) return false;
    return this.items.length > 0;
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

  private markChanged(): void {
    this.synced = false;
    this.localVersion++;
  }

  public plusProduct(product: Product, amount = 1): void {
    this.markChanged();
    this.prices[product.name] = Number(product.price);
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
  }

  public minusProduct(product: Product): void {
    if (this.items !== null) {
      const orderItem = this.getOrderItem(product);
      if (orderItem !== null) {
        this.markChanged();
        orderItem.amount--;
        if (orderItem.amount === 0) {
          this.items = this.items.filter(
            (item) => item.product !== product.name
          );
        }
        orderItem.total = product.price * orderItem.amount;
      }
    }
  }

  public deleteProduct(product: Product): void {
    if (this.items !== null) {
      const orderItem = this.getOrderItem(product);
      if (orderItem !== null) {
        this.markChanged();
        this.items = this.items.filter((item) => item.product !== product.name);
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

  public updateFromAPI(o: _Order, sentVersion: number | null = null): void {
    if (sentVersion !== null && sentVersion !== this.localVersion) {
      // The order was changed locally while this request was in flight. Keep
      // the local items (otherwise those clicks are lost) and stay unsynced so
      // the changes get sent in a follow-up request.
      this._o = o;
      return;
    }
    this.synced = true;
    this._o = o;
    this.items = o.order_items;

    if (this.hasPayer() && this.payerIsAdult()) {
      this.ageCheckPerformed = true;
    }
  }

  public getAPIData(): { order_items: OrderItem[] } {
    // Copy the items: mutating them would wipe the locally known totals.
    const data = (this.items ?? []).map((i) => ({
      product: i.product,
      amount: i.amount,
    }));
    return { order_items: data };
  }

  static orderFromAPI(o: _Order): Order {
    const order: Order = new Order();
    order._o = o;
    return order;
  }
}

export default Order;

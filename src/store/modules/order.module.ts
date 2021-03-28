import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({ namespaced: true })
class Order extends VuexModule {
  _o: _Order;
  __o: _Order;
  synced = true;

  constructor(order: _Order) {
    super(Order);
    this.__o = order;
    this._o = { ...order };
  }

  getAPIDataDiff() {
    // eslint-disable-next-line @typescript-eslint/camelcase
    return { order_items: this._o.order_items };
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

  @Action
  pushToServer() {}

  @Action
  plusProduct(product: Product) {
    this.context.commit("setSynced", false);
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

  @Mutation
  increaseAmount(product: Product) {
    this.getOrderItem(product).amount++;
  }

  @Mutation
  setSynced(value: boolean) {
    this.synced = value;
  }

  @Action
  minusProduct(product: Product) {
    if (this._o.order_items == null) {
      console.log("Deleting a non-existent product");
    } else {
      const orderItem = this.getOrderItem(product);
      if (orderItem == null) {
        console.log("Deleting a non-existent product");
      } else {
        this.synced = false;
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
        this.synced = false;
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

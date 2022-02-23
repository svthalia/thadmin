<template>
  <div class="square-wrapper">
    <div
      class="card square border-0 p-0 shadow user-select-none"
      :class="{ 'hide-pointer': paid }"
      v-on="!paid ? { click: increment } : {}"
    >
      <div class="card-body p-2">
        <div class="row m-0 p-0">
          <div class="col-9 p-0 m-0">
            <h5 class="card-title font-oswald p-0 m-0">{{ product.name }}</h5>
          </div>
          <div class="col-3 p-0 m-0">
            <h5
              class="font-oswald m-0 float-end"
              style="color: #e62272"
              v-if="amount > 0"
            >
              {{ amount }}
            </h5>
          </div>
        </div>
        <p class="price p-0 m-0">
          €{{ product.price }} <span v-if="product.age_restricted">• 18+</span>
        </p>
      </div>
      <div class="card-footer bg-white p-0 border-0">
        <div class="d-flex align-content-stretch align-items-stretch">
          <button
            v-on:click.stop
            class="btn btn-danger flex-grow-1 px-0 py-2 m-0 text-white"
            :class="{ disabled: amount <= 0 || paid }"
            v-on="(amount > 0) & !paid ? { click: del } : {}"
          >
            <i class="fas fa-trash"></i>
          </button>
          <button
            v-on:click.stop
            class="btn btn-warning flex-grow-1 px-0 py-2 m-0 text-white"
            :class="{ disabled: amount <= 0 || paid }"
            v-on="(amount > 0) & !paid ? { click: decrement } : {}"
          >
            <i class="fas fa-minus"></i>
          </button>
          <button
            v-on:click.stop
            class="btn btn-success flex-grow-1 px-0 py-2 m-0 text-white"
            :class="{ disabled: paid }"
            v-on="!paid ? { click: increment } : {}"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Order from "@/models/order.model";
import Product from "@/models/product.model";

export default {
  name: "ProductCard",
  props: {
    product: Product,
    order: Order,
  },
  computed: {
    amount: function () {
      if (this.order) {
        return this.order.productAmount(this.product);
      }
      return 0;
    },
    paid: function () {
      if (this.order) {
        return this.order.isPaid() || this.order.hasPayer();
      }
      return false;
    },
  },
  methods: {
    itemsInBasked: function () {
      return this.amount > 0;
    },
    increment() {
      this.order.plusProduct(this.product);
    },
    decrement() {
      this.order.minusProduct(this.product);
      if (!this.order.hasProducts()) {
        this.$parent.reset();
      }
    },
    del() {
      this.order.deleteProduct(this.product);
      if (!this.order.hasProducts()) {
        this.$parent.reset();
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
  font-family: "Open Sans", sans-serif;
}
button {
  border-radius: 0;
}

.square-wrapper {
  position: relative;
  width: 100%;
}

.square-wrapper:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}
.square {
  position: absolute;
  width: 100%;
  height: 100%;
}

.card-body {
  overflow-x: hidden;
  overflow-y: scroll;
}
.disabled {
  visibility: hidden;
}
.user-select-none {
  cursor: pointer;
}
.hide-pointer {
  cursor: default !important;
}
</style>

<template>
  <div class="card m-1 shadow" :class="{ 'show-pointer': !paid }" v-on="!paid ? { click: increment } : {}">
    <div class="card-body user-select-none">
      <div class="d-flex align-items-center">
        <h4 class="card-title flex-grow-0 mb-0 mr-auto font-oswald">{{ product.name }}</h4>
        <span class="flex-grow-0 amount" v-if="amount>0">{{ amount }}</span>
      </div>
      <p class="price">€{{ product.price }} <span v-if="product.age_restricted">• 18+</span></p>
    </div>
    <div class="card-footer">
      <div class="d-flex flex-row justify-content-center align-items-center">
        <button v-on:click.stop class="btn btn-danger mx-1 text-white" :class="{ 'disabled': amount<=0 || paid }" v-on="amount>0 & !paid ? { click: del } : {}"><i class="fas fa-trash"></i></button>
        <button v-on:click.stop class="btn btn-warning mx-1 text-white" :class="{ 'disabled': amount<=0 || paid }" v-on="amount>0 & !paid ? { click: decrement } : {}"><i class="fas fa-minus"></i></button>
        <button v-on:click.stop class="btn btn-success mx-1 text-white" :class="{ 'disabled': paid }" v-on="!paid ? { click: increment } : {}"><i class="fas fa-plus"></i></button>
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
    amount: function() {
      if (this.order) {return this.order.productAmount(this.product);}
      return 0;
    },
    paid: function() {
      if (this.order) {return this.order.isPaid();}
      return false;
    }
  },
  methods: {
    itemsInBasked: function() {
      return this.amount > 0;
    },
    increment() {
      this.order.plusProduct(this.product);
    },
    decrement() {
      this.order.minusProduct(this.product);
    },
    del() {
      this.order.deleteProduct(this.product);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media screen and (max-width: 767px) {
  .card {
    font-size: 0.5rem;
    max-width: calc(50% - 0.5rem);
  }

  .btn {
    font-size: 0.5rem;
    padding: 0.2rem 0.4rem;
  }
}

p {
  font-family: 'Open Sans', sans-serif;
}

.show-pointer {
  cursor: pointer;
}

.amount {
  color: #e62272;
  font-size: 1.2rem;
  text-align: center;
  font-family: 'Oswald', sans-serif;
}

</style>

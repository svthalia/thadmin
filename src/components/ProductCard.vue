<template>
  <div class="card m-1" style="cursor: pointer;" v-on:click="increment">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <h4 class="card-title flex-grow-0 mb-0">{{ product.name }}</h4>
        <p class="card-subtitle flex-grow-0 mr-auto ml-2" v-if="product.age_restricted"><i class="fas fa-id-card"></i></p>
        <span class="ml-3 flex-grow-0 amount" v-if="amount>0">{{ amount }}</span>
      </div>
      <p class="price">€{{ product.price }}</p>
    </div>
    <div class="card-footer">
      <div class="d-flex flex-row justify-content-center align-items-center">
        <button v-on:click.stop class="btn btn-danger mx-1 text-white" :class="{ 'disabled': amount<=0 }" v-on="amount>0 ? { click: del } : {}"><i class="fas fa-trash"></i></button>
        <button v-on:click.stop class="btn btn-warning mx-1 text-white" :class="{ 'disabled': amount<=0 }" v-on="amount>0 ? { click: decrement } : {}"><i class="fas fa-minus"></i></button>
        <button v-on:click.stop class="btn btn-success mx-1 text-white" v-on:click="increment"><i class="fas fa-plus"></i></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: null,
    order: null,
  },
  computed: {
    amount: function() {
      if (this.order) {return this.order.productAmount(this.product)}
      return 0;
    }
  },
  methods: {
    itemsInBasked: function() {
      return this.amount > 0;
    },
    increment() {
      if (this.order === null || this.order === undefined){
        this.$parent.nextOrder().then(() => {
          this.order.plusProduct(this.product);
          this.$parent.updateCurrentOrder();
        });
      }
      else {
        this.order.plusProduct(this.product);
      }
    },
    decrement() {
      this.order.minusProduct(this.product)
    },
    del() {
      this.order.deleteProduct(this.product)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media screen and (max-width: 767px) {
  .card {
    font-size: 0.5rem;
    max-width: calc(50% - 0.5rem - 20px);
  }
}

p {
  font-family: 'Open Sans', sans-serif;
}

.buttons button {
  padding: 8px;
  width: 40px;
  height: 40px;
  color: white;
  border: none;
  border-radius: 0;
  margin: 2px;
}

.buttons button:focus {
  border: 1px solid #000000;
  border-radius: 0;
  outline: 0;
}
.buttons button:active {
  border: 3px solid #000000;
  border-radius: 0;
  outline: 0;
}

.amount {
  color: #e62272;
  font-size: 24pt;
  text-align: center;
  font-family: 'Oswald', sans-serif;
}


.product-card {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

</style>

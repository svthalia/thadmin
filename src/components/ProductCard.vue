<template>
  <div class="product-card" v-on:click="increment">
    <h4 class="title">{{ product.name }}</h4>
    <p class="price">€{{ product.price }}</p>
    <p class="agerestricted" v-if="product.age_restricted">18+</p>
    <span class="amount" v-if="amount>0">{{ amount }}</span>
    <div class="buttons" v-on:click.stop>
      <button class="trash" v-if="amount>0" v-on:click="del"><i class="fas fa-trash"></i></button>
      <button class="minus" v-if="amount>0" v-on:click="decrement"><i class="fas fa-minus"></i></button>
      <button class="plus" v-on:click="increment"><i class="fas fa-plus"></i></button>
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
    increment() {
      if (this.order === null || this.order === undefined){
        this.$parent.nextOrder().then(() => {
          this.order.plusProduct(this.product);
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
.product-card {
  position: relative;
  background-color: #FFFFFF;
  height: auto;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  padding: 10px;
  display: inline-block;
}


.title {
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  font-size: 30px;
}

p {
  font-family: 'Open Sans', sans-serif;
}

.buttons {
  right: 10px;
  bottom: 10px;
  position: absolute;
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
  background-color: #e62272;
  font-size: 35px;
  color: white;
  right: 10px;
  top: 10px;
  position: absolute;
  padding: 10px;
  width: 60px;
  height: 60px;
  line-height: 1;
  text-align: center;
}
.amount {
  font-family: 'Oswald', sans-serif;
}


.trash {
  background-color: red;
}

.trash:hover {
  background-color: darkred;
}


.minus {
  background-color: darkgrey;
}
.minus:hover {
  background-color: grey;
}


.plus {
  background-color: green;
}
.plus:hover {
  background-color: darkgreen;
}

.product-card {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

</style>

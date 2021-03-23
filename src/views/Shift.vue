<template>
  <div v-if="shift">
    <div class="row">
      <div class="products">
        <ProductCard v-for="product in shift.products" :key="product.name" v-bind:product="product" v-bind:order="order"></ProductCard>
        <div id="dev-controls">
          <button v-on:click="nextOrder">Create next order</button>
          <button v-on:click="updateCurrentOrder">Update current order</button>
        </div>
      </div>
      <OrderCard class="order-card" v-bind:order="order"></OrderCard>
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/ProductCard";
import OrderCard from "@/components/OrderCard";
import SalesService from "@/common/sales.service";

let salesService = new SalesService();

export default {
  name: 'ShiftConsole',
  components: {OrderCard, ProductCard},
  props: {
    shiftId: String,
  },
  methods: {
    nextOrder: async function () {
      await salesService.newOrder(parseInt(this.shiftId)).then((order) => (this.order = order));
    },
    updateCurrentOrder: function () {
      if (this.order == null) {
        salesService.newOrder(parseInt(this.shiftId)).then((order) => (this.order = order));
      }
      salesService.updateOrder(this.order).then((order) => (this.order = order));
    }
  },
  data () {
    return {
      shift: null,
      order: null,
    }
  },
  mounted () {
    salesService.getShift(parseInt(this.shiftId)).then((shift) => (this.shift = shift));
  },
}
</script>

<style scoped>

.row {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas:
    "left right";
  z-index: 1;
}

.products {
  grid-area: left;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  height: calc(100% - 50px);
  width: calc(100% - 50px);
  margin: 15px;
}

.order-card {
  grid-area: right;
}

</style>

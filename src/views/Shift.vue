<template>
  <div v-if="shift">
    <div class="row">
      <div class="products-wrapper">
        <div class="products">
          <ProductCard v-for="product in shift.products" :key="product.name" v-bind:product="product" v-bind:order="order"></ProductCard>
        </div>
      </div>
      <div class="card">
        <OrderCard v-if="order" v-bind:order="order"></OrderCard>
      </div>
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
      await salesService.newOrder(parseInt(this.shiftId), null).then((order) => (this.order = order));
    },
    updateCurrentOrder: async function () {
      if (this.order == null) {
        await salesService.newOrder(parseInt(this.shiftId)).then((order) => (this.order = order));
      }
      await salesService.updateOrder(this.order).then((order) => (this.order = order));
    },
    fetchOrderUpdates: async function() {
      if (this.order != null && this.order.synced && !this.order._o.payment) {
        await salesService.getOrderDetails(this.order._o.pk).then((order) => {if (this.order.synced){this.order = order}});
      }
    },
    reset: function () {
      this.order = null;
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
    setInterval(this.fetchOrderUpdates, 2000);
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
    "products ordercard";
  z-index: 1;
}

.products-wrapper {
  grid-area: products;
  height: min-content;
  max-height: 100%;
  overflow-y: scroll;
}

.products {
  display: grid;
  margin: 15px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px 15px;
  justify-items: start;
  align-items: start;
  align-content: start;
}

.card {
  grid-area: ordercard;
  max-height: 100%;
  margin: 15px;
  background-color: #FFFFFF;
  padding: 20px;
}

@media only screen and (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr minmax(min-content, 35vh);
    grid-template-areas:
    "ordercard"
    "products";
  }
}

</style>

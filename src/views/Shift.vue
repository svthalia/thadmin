<template>
  <div v-if="shift" class="container mt-5">
    <div class="row flex-column-reverse flex-md-row">
      <div class="products-wrapper col-md">
        <div class="d-flex justify-content-start align-items-center flex-wrap">
          <ProductCard v-for="product in shift.products" :key="product.name" v-bind:product="product" v-bind:order="order"></ProductCard>
        </div>
      </div>
      <div class="col-md">
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
  created() {
  },
  mounted () {
    salesService.getShift(parseInt(this.shiftId)).then((shift) => (this.shift = shift));
    setInterval(this.fetchOrderUpdates, 2000);
  },
}
</script>

<style scoped>

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

</style>

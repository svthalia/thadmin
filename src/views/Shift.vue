<template>
  <div class="container mt-5">
    <div class="row">
      <router-link class="d-flex justify-content-center align-items-center" :to="{ name: 'Shifts' }">
        <i class="fas fa-arrow-left"></i><span class="ml-1">All shifts</span>
      </router-link>
    </div>
    <div class="row flex-column-reverse flex-md-row mt-1" v-if="shift">
      <div class="products-wrapper col-md-8">
        <div class="d-flex flex-wrap card-deck product-cards">
          <ProductCard v-for="product in shift.products" :key="product.name" v-bind:product="product" v-bind:order="order"></ProductCard>
        </div>
      </div>
      <div class="col-md-4">
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

.product-cards {
  justify-content: space-between;
}

@media screen and (max-width: 767px) {
  .product-cards {
    justify-content: center;
  }
}

</style>

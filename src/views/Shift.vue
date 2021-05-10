<template>
  <div class="progress" style="height: 5px; border-radius: 0;">
    <div class="progress-bar" role="progressbar" :style="{ maxWidth: '100%', width: shiftProgress + '%' }" :aria-valuenow="shiftProgress" aria-valuemin="0" aria-valuemax="100"></div>
  </div>
  <div class="container">
    <div class="row flex-column-reverse flex-md-row mt-4" v-if="shift">
      <div class="products-wrapper col-md-8">
        <div class="alert alert-info mt-2" role="alert" v-if="shiftProgress>=100">
          This shift has ended. However, as long as the shift has not yet been locked, you can still process orders.
        </div>
        <div class="d-flex flex-wrap card-deck product-cards">
          <ProductCard v-for="product in shift.products" :key="product.name" v-bind:product="product" v-bind:order="order"></ProductCard>
        </div>
      </div>
      <div class="col-md-4">
        <OrderCard v-if="order" v-bind:order="order"></OrderCard>
      </div>
    </div>
    <div v-else class="d-flex justify-content-center align-items-center">
      <Loader size="60px" background-color="#000000"></Loader>
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/ProductCard";
import OrderCard from "@/components/OrderCard";
import SalesService from "@/common/sales.service";
import Order from "@/models/order.model";
import Loader from "@/components/Loader";

let salesService = new SalesService();

export default {
  name: 'ShiftConsole',
  components: {
    OrderCard,
    ProductCard,
    Loader
  },
  props: {
    shiftId: String,
  },
  methods: {
    nextOrder: function () {
      this.order = new Order();
    },
    updateCurrentOrder: async function () {
      if (this.order == null) {
        this.nextOrder();
      }
      await salesService.updateOrder(this.order, parseInt(this.shiftId)).then((order) => (this.order = order));
    },
    fetchOrderUpdates: async function() {
      if (this.order != null && this.order._o && this.order.synced && !this.order._o.payment) {
        await salesService.getOrderDetails(this.order).then((order) => {if (this.order.getPK() === order._o.pk) {this.order = order}});
      }
    },
    fetchShiftUpdates: async function() {
      await salesService.getShift(this.shiftId).then((shift) => this.shift = shift)
    },
    recalculateProgress: function () {
      const now = new Date();
      const shiftStart = new Date(this.shift.start);
      const shiftEnd = new Date(this.shift.end);
      this.shiftProgress = ((now - shiftStart) / (shiftEnd - shiftStart) * 100);
    },
    done: function () {
      this.order = new Order();
    },
    reset: function () {
      salesService.deleteOrder(this.order);
      this.order = new Order();
    }
  },
  data () {
    return {
      shift: null,
      order: null,
      shiftProgress: 0,
    }
  },
  mounted () {
    this.nextOrder();
    salesService.getShift(parseInt(this.shiftId)).then((shift) => {this.shift = shift; this.recalculateProgress()});
    this.fetchOrderUpdatesInterval = setInterval(this.fetchOrderUpdates, 3000);
    this.fetchShiftInterval = setInterval(this.fetchShiftUpdates, 20000);
    this.progressInterval = setInterval(this.recalculateProgress, 5000);
  },
  destroyed: function() {
    clearInterval(this.fetchOrderUpdatesInterval);
    clearInterval(this.fetchShiftInterval);
    clearInterval(this.progressInterval);
  }
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

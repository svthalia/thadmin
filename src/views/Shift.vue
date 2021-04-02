<template>
  <div class="progress" style="height: 5px; border-radius: 0;">
    <div class="progress-bar" role="progressbar" :style="{ maxWidth: '100%', width: shiftProgress + '%' }" :aria-valuenow="shiftProgress" aria-valuemin="0" aria-valuemax="100"></div>
  </div>
  <div class="container">
    <div class="row flex-column-reverse flex-md-row mt-4" v-if="shift">
      <div class="products-wrapper col-md-8">
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
    recalculateProgress: function () {
      const now = new Date();
      const shiftStart = new Date(this.shift.start_date);
      const shiftEnd = new Date(this.shift.end_date);
      this.shiftProgress = ((now - shiftStart) / (shiftEnd - shiftStart) * 100);
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
    salesService.getShift(parseInt(this.shiftId)).then((shift) => (this.shift = shift));
    setInterval(this.fetchOrderUpdates, 2000);
    setInterval(this.recalculateProgress, 5000);
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

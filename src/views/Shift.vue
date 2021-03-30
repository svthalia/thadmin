<template>
  <div class="progress" style="height: 5px; border-radius: 0;">
    <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
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
  </div>
</template>

<script>
import ProductCard from "@/components/ProductCard";
import OrderCard from "@/components/OrderCard";
import SalesService from "@/common/sales.service";
import Order from "@/models/order.model";

let salesService = new SalesService();

export default {
  name: 'ShiftConsole',
  components: {OrderCard, ProductCard},
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
        await salesService.getOrderDetails(this.order).then((order) => (this.order = order));
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
    this.nextOrder();
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

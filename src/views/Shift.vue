<template>
  <div class="progress" style="height: 5px; border-radius: 0">
    <div
      class="progress-bar"
      role="progressbar"
      :style="{ maxWidth: '100%', width: shiftProgress + '%' }"
      :aria-valuenow="shiftProgress"
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>
  </div>
  <div class="container mt-2 mt-md-4 mb-2">
    <div
      class="alert alert-info mt-2 user-select-none"
      style="cursor: default"
      role="alert"
      v-if="shiftProgress >= 100"
    >
      This shift has ended. However, as long as the shift has not yet been
      locked, you can still process orders.
    </div>
    <div class="row flex-column-reverse flex-md-row px-2" v-if="shift">
      <div class="products-wrapper col-md-7">
        <div class="product-cards row row-cols-3 row-cols-lg-4">
          <div
            class="col p-1 p-sm-2"
            v-for="product in shift.products"
            :key="product"
          >
            <ProductCard
              :key="product.name"
              v-bind:product="product"
              v-bind:order="order"
            ></ProductCard>
          </div>
        </div>
      </div>
      <div class="col-md-5 p-1 p-sm-2 mb-2 mb-md-0">
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
  name: "ShiftConsole",
  components: {
    OrderCard,
    ProductCard,
    Loader,
  },
  props: {
    shiftId: String,
  },
  methods: {
    nextOrder: function () {
      this.order = new Order();
    },
    updateCurrentOrder: async function () {
      if (this.order === null) {
        this.nextOrder();
      }
      if (this.order.hasProducts()) {
        clearTimeout(this.fetchOrder);
        this.order = await salesService.updateOrder(
          this.order,
          parseInt(this.shiftId)
        );
        this.fetchOrder = setTimeout(
          this.fetchOrderUpdates,
          this.ORDER_REFRESH_RATE
        );
      }
      this.updateOrderToServer = null;
    },
    fetchOrderUpdates: async function () {
      if (this.orderBeingUpdated || this.updateOrderToServer != null) {
        // Do not GET if we're waiting for the response of a PUT
        this.fetchOrder = setTimeout(
          this.fetchOrderUpdates,
          this.ORDER_REFRESH_RATE
        );
        return;
      }
      const order = await salesService.getOrderDetails(this.order);
      if (this.order.getPK() === order._o.pk) {
        this.order = order;
      }
      this.fetchOrder = setTimeout(
        this.fetchOrderUpdates,
        this.ORDER_REFRESH_RATE
      );
    },
    fetchShiftUpdates: async function () {
      this.shift = await salesService.getShift(parseInt(this.shiftId));
      this.fetchShift = setTimeout(
        this.fetchShiftUpdates,
        this.SHIFT_REFRESH_RATE
      );
    },
    recalculateProgress: function () {
      const now = new Date();
      const shiftStart = new Date(this.shift.start);
      const shiftEnd = new Date(this.shift.end);
      this.shiftProgress = ((now - shiftStart) / (shiftEnd - shiftStart)) * 100;
    },
    done: function () {
      this.order = new Order();
    },
    reset: function () {
      if (this.orderBeingUpdated) {
        return;
      }
      clearTimeout(this.fetchOrder);
      clearTimeout(this.updateOrderToServer);
      this.updateOrderToServer = null;
      salesService.deleteOrder(this.order);
      this.order = new Order();
    },
    startFetching: function () {
      clearTimeout(this.fetchOrder);
      this.fetchOrder = setTimeout(
        this.fetchOrderUpdates,
        this.ORDER_REFRESH_RATE
      );
      this.fetchingTimedOut = false;
      clearTimeout(this.stopFetchingTimer);
      this.stopFetchingTimer = setTimeout(() => {
        this.fetchingTimedOut = true;
        clearTimeout(this.fetchOrder);
      }, this.ORDER_REFRESH_TIMEOUT);
    },
    manualOrderSync: function () {
      this.updateCurrentOrder();
      this.startFetching();
    },
    deleteIfOrphan: function () {
      if (!this.order.isPaid()) salesService.deleteOrder(this.order);
    },
  },
  data() {
    return {
      ORDER_REFRESH_WAIT: 1000,
      ORDER_REFRESH_RATE: 2000,
      ORDER_REFRESH_TIMEOUT: 30000,
      SHIFT_REFRESH_RATE: 30000,
      shift: null,
      order: null,
      shiftProgress: 0,
      fetchingTimedOut: false,
      updateOrderToServer: null,
      orderBeingUpdated: false,
    };
  },
  computed: {
    awaitingPayment: function () {
      return (
        this.order !== null &&
        this.order._o &&
        this.order.synced &&
        !this.order._o.payment
      );
    },
  },
  watch: {
    order: {
      handler(val) {
        clearTimeout(this.updateOrderToServer);
        clearTimeout(this.stopFetchingTimer);
        if (this.awaitingPayment) return;
        this.updateOrderToServer = setTimeout(
          this.updateCurrentOrder,
          this.ORDER_REFRESH_WAIT
        );
      },
      deep: true,
    },
    shift: {
      handler(_) {
        this.recalculateProgress();
      },
      deep: true,
    },
    awaitingPayment: function (val) {
      clearTimeout(this.stopFetchingTimer);
      this.fetchingTimedOut = false;
      if (val) {
        this.startFetching();
      }
    },
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.deleteIfOrphan);
  },
  mounted() {
    this.fetchShiftUpdates();
    this.nextOrder();
  },
  unmounted() {
    clearTimeout(this.updateOrderToServer);
    clearTimeout(this.fetchOrder);
    clearTimeout(this.fetchShift);
    clearTimeout(this.stopFetchingTimer);
    this.deleteIfOrphan();
  },
};
</script>

<style>
button,
.card,
.card-header,
.card-body,
.card-footer {
  border-radius: 0 !important;
}
</style>

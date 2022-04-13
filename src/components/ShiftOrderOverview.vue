<template>
  <div
    class="modal fade"
    v-bind:id="id"
    tabindex="-1"
    role="dialog"
    v-bind:aria-labelledby="id"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Orders for shift</h5>
          <button
            type="button"
            class="close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body text-center">
          <ul id="orders">
            <li v-for="order in orders" :key="order.pk">
              <ul>
                <li>pk: {{ order.pk }}</li>
                <li>created: {{ order.created_at }}</li>
                <li>total amount: € {{ order.total_amount }}</li>
                <li>#items: {{ order.num_items }}</li>
              </ul>

            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click="refreshOrderOverview"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SalesService from "@/common/sales.service";
import Shift from "@/models/shift.model";

let salesService = new SalesService();

export default {
  name: "ShiftOrderOverview",
  props: {
    shift: Shift,
    id: String,
  },
  methods: {
    refreshOrderOverview: function () {
      salesService.getShiftOrders(this.shift).then((o) => {
        this.orders = o
      });
    },
  },
  data() {
    return {
      orders: null,
    };
  },
};
</script>

<style scoped></style>

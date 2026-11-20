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
          <h5 class="modal-title">Register {{ paymentMethod }} payment</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-center">
          <span class="mb-3">To be paid:</span>
          <br />
          <span class="font-oswald fw-bold display-2"
            >€{{ order.getAmount()?.toFixed(2) ?? "?" }}</span
          >
          <br />
          <span class="mb-3">{{ order.getDescription() }}</span>
          <div class="mt-4" v-if="order.isAgeRestricted()">
            <span class="mb-1"
              >This order contains age restricted products.</span
            >
            <button
              type="button"
              class="btn btn-outline-success"
              v-bind:class="{
                'btn-success text-white': order.ageCheckPerformed,
              }"
              data-bs-toggle="button"
              autocomplete="off"
              aria-pressed="true"
              @click="toggleAgeCheck"
            >
              I verified that this person is 18+
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            :disabled="order.isAgeRestricted() && !order.ageCheckPerformed"
            data-bs-dismiss="modal"
            @click="registerPayment"
          >
            Register {{ paymentMethod }} payment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Order from "@/common/sales.service";
import SalesService from "@/common/sales.service";

let salesService = new SalesService();

export default {
  name: "OrderCard",
  props: {
    order: Order,
    paymentMethod: String,
    id: String,
  },
  methods: {
    toggleAgeCheck: function () {
      this.order.ageCheckPerformed = !this.order.ageCheckPerformed;
    },
    registerPayment: async function () {
      try {
        await salesService.createPayment(this.order, this.paymentMethod);
        // Refresh the order so the order card shows the payment confirmation.
        await salesService.getOrderDetails(this.order);
      } catch (e) {
        alert(
          `Registering the ${this.paymentMethod} payment failed. Please try again.`
        );
        return;
      }
      if (!this.order.isPaid()) {
        alert(
          `The ${this.paymentMethod} payment could not be confirmed. Please check the order and try again.`
        );
      }
    },
  },
};
</script>

<style scoped></style>

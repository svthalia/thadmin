<template>
  <div class="modal fade" v-bind:id="id" tabindex="-1" role="dialog" v-bind:aria-labelledby="id" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Register {{paymentMethod}} payment</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body text-center">
          <span class="mb-3">To be paid:</span>
          <br>
          <span class="font-oswald font-weight-bold display-2">€{{order.getAmount()}}</span>
          <br>
          <span class="mb-3">{{order.getDescription()}}</span>
          <div class="mt-4" v-if="order.isAgeRestricted()">
            <span class="mb-1">This order contains age restricted products.</span>
            <button type="button" class="btn btn-outline-success" v-bind:class="{ 'btn-success text-white': order.ageCheckPerformed }" data-bs-toggle="button" autocomplete="off" aria-pressed="true" @click="toggleAgeCheck">I verified that this person is 18+</button>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" :disabled="order.isAgeRestricted() && !order.ageCheckPerformed" data-dismiss="modal" @click="registerPayment">Register {{paymentMethod}} payment</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Order from '@/common/sales.service'

export default {
  name: 'OrderCard',
  props: {
    order: Order,
    paymentMethod: String,
    id: String,
  },
  methods: {
    toggleAgeCheck: function () {
      this.order.ageCheckPerformed = !this.order.ageCheckPerformed;
    },
    registerPayment: function () {
      // Register a payment
      // Refresh the order from server
     return true;
    }
  },
}
</script>

<style scoped>

</style>
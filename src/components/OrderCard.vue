<template>
  <div class="order-card" v-if="order">
    <div class="order-card-header">
      <p class="order-summary">
        <span class="order-description">{{order.order.order_description}}</span> - <span class="payment-amount">€{{order.order.payment_amount}}</span>
      </p>
      <p class="order-details" v-if="order.order.pk">Order {{ order.order.pk }}</p>
    </div>

    <div class="payment-info" v-if="order.order.payment">
      <img class="payer-img" src="https://pbs.twimg.com/profile_images/1013449906151940096/0NnKwYgr_400x400.jpg">
    </div>

<!--    <vue-qrcode class="qr-code" v-else-if="order.order.payment_url" v-bind:value="order.order.payment_url" />-->

    <button class="order-sync" v-else v-on:click="updateOrder"><i class="fas fa-sync"></i></button>


    <div class="order-card-footer">
      <p v-if="!order.order.payment">OR REGISTER A</p>
      <p v-if="!order.order.payment">
        <button class="cash-payment"><i class="fas fa-coins"></i> Cash payment</button>
        <button class="card-payment"><i class="fas fa-credit-card"></i> Card payment</button>
      </p>
    </div>
  </div>
</template>

<script>
import Order from '@/common/sales.service'
// import VueQrcode from 'vue-qrcode';

export default {
  name: 'OrderCard',
  // components: {VueQrcode},
  props: {
    order: Order
  },
  methods: {
    updateOrder: function () {
      this.$parent.updateCurrentOrder();
    }
  }
}
</script>

<style scoped>

.order-card {
  position: relative;
  background-color: #FFFFFF;
  height: calc(100% - 50px);
  width: calc(100% - 50px);
  overflow: hidden;
  padding: 20px;
  margin: 25px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.order-card-header, .order-card-footer {
  height: 100px;
}

.order-card-header {

}


p {
  font-family: 'Open Sans', sans-serif;
  text-align: center;
}
.order-summary {
  font-size: 20px;
}
.order-details {
  font-size: 12px;
}

.qr-code, .payer-img {
  display:block;
  margin:auto;
  width: 80%;
}

button {
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  font-size: 20px;
  background-color: #e62272;
  padding: 8px;
  color: white;
  border: none;
  border-radius: 0;
  margin: 2px;
}

button:focus {
  border: 1px solid #000000;
  border-radius: 0;
  outline: 0;
}
button:active {
  border: 3px solid #000000;
  border-radius: 0;
  outline: 0;
}
</style>
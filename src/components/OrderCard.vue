<template>
  <div class="order-card" v-if="order">
      <div class="order-card-header">
        <p class="order-summary">
          <span class="order-description">{{order._o.order_description}}</span> - <span class="payment-amount">€{{order._o.payment_amount}}</span>
        </p>
        <p class="order-details" v-if="order._o.pk">Order {{ order._o.pk }}</p>
      </div>

      <div class="order-card-center">
        <div class="payment-info" v-if="order._o.payment">
          <img class="payer-img" src="https://pbs.twimg.com/profile_images/1013449906151940096/0NnKwYgr_400x400.jpg">
        </div>

        <qrcode-vue class="qr-code" v-else-if="order._o.payment_url" v-bind:value="order._o.payment_url" v-bind:size="1024" renderAs="svg" level="M" />

        <button class="order-sync" v-else v-on:click="updateOrder"><i class="fas fa-sync"></i></button>
      </div>

      <div class="order-card-footer">
        <p v-if="!order._o.payment">OR REGISTER A</p>
        <p v-if="!order._o.payment">
          <button class="cash-payment"><i class="fas fa-coins"></i> Cash payment</button>
          <button class="card-payment"><i class="fas fa-credit-card"></i> Card payment</button>
        </p>
      </div>
    </div>
</template>

<script>
import Order from '@/common/sales.service'
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'OrderCard',
  components: {
    QrcodeVue
  },
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
  overflow: hidden;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 4fr 1fr;
  gap: 10px 0;
  grid-template-areas:
    "header"
    "center"
    "footer";
  justify-items: center;
  align-items: center;
}

.order-card-header {
  grid-area: header;
  align-self: start;
}
.order-card-center {
  grid-area: center;
}
.order-card-footer {
  grid-area: footer;
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
  height: 100%;
}

.qr-code canvas {
  width: 100%;
  height: 100%;
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
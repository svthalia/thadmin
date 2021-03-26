<template>
  <div class="order-card" v-if="order">
      <div class="order-card-header" v-bind:class="{ blurred: needsSync() }">
        <p class="order-summary">
          <span class="order-description">{{order._o.order_description}}</span> - <span class="payment-amount">€{{order._o.payment_amount}}</span>
        </p>
        <p class="order-details" v-if="order._o.pk">Order {{ order._o.pk }}</p>
      </div>

      <div class="order-card-center">
        <div class="payment-info" v-if="order._o.payment">
          <img class="payer-img" src="https://pbs.twimg.com/profile_images/1013449906151940096/0NnKwYgr_400x400.jpg">
          <button class="done" v-on:click="done">Done</button>
        </div>

        <qrcode-vue class="qr-code" v-bind:class="{ blurred: needsSync() }" v-else-if="order._o.payment_url" v-bind:value="order._o.payment_url" v-bind:size="1024" renderAs="svg" level="M" />

        <button class="order-sync" v-if="!order._o.payment && needsSync()" v-on:click="updateOrder"><i class="fas fa-sync"></i></button>
      </div>

      <div class="order-card-footer" v-bind:class="{ blurred: needsSync() }">
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
    order: Order | null
  },
  methods: {
    done: function () {
      this.$parent.reset();
    },
    updateOrder: function () {
      this.$parent.updateCurrentOrder();
    },
    needsSync: function () {
      return !this.order.synced;
    },
    paymentInfo: function () {

    }

  }
}
</script>

<style scoped>

.order-card {
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
  height: 100%;
  width: 100%;
}

.order-card-header {
  grid-area: header;
  align-self: start;
}
.order-card-center {
  grid-area: center;
  width: 100%;
  min-width: 100px;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
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

.qr-code, .payer-img, .payment-info {
  display:block;
  position: absolute;
  max-height: 100%;
  max-width: 100%;
  min-height: 100px;
  min-width: 100px;
}


.qr-code canvas {
  position: relative;
  aspect-ratio: 1/1;
}

.order-sync {
  position: relative;
  display: block;
  margin: auto;
  width: 100px;
  height: 100px;;
}

button {
  position: relative;
  display: inline-block;
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  font-size: 20px;
  background-color: #e62272;
  padding: 8px;
  color: white;
  border: none;
  border-radius: 0;
  margin: 2px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  width: fit-content;
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

.blurred {
  filter: blur(5px);
  transition: all 0.5s ease;
}

.qr-code.blurred {
  filter: blur(15px);
}

</style>
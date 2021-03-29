<template>
  <div class="card text-center mb-3 user-select-none" v-if="order">
      <div v-bind:class="{ blurred: needsSync() }" style="transition: all 0.5s ease;">
        <div class="card-header">
          <span class="order-description">{{order._o.order_description}}</span> - <span class="payment-amount">€{{order._o.payment_amount}}</span>
        </div>

        <div class="card-body">
          <p class="order-details" v-if="order._o.pk">Order {{ order._o.pk }}</p>
          <div class="payment-info" v-if="order._o.payment">
            <img class="payer-img" src="https://pbs.twimg.com/profile_images/1013449906151940096/0NnKwYgr_400x400.jpg">
            <button class="done" v-on:click="done">Done</button>
          </div>

          <qrcode-vue class="qr-code p-3 h-auto" v-bind:class="{ blurred: needsSync() }" v-else-if="order._o.payment_url" v-bind:value="order._o.payment_url" v-bind:size="1024" renderAs="svg" level="M" />
        </div>

        <div class="card-footer" v-bind:class="{ blurred: needsSync() }">
          <p v-if="!order._o.payment" class="text-uppercase">or register a</p>
          <p v-if="!order._o.payment">
            <button class="btn btn-primary m-1"><i class="fas fa-coins"></i> Cash payment</button>
            <button class="btn btn-primary m-1"><i class="fas fa-credit-card"></i> Card payment</button>
          </p>
        </div>
      </div>
      <div class="position-absolute d-flex align-items-center justify-content-center w-100 h-100" v-if="!order._o.payment && needsSync()">
        <button class="btn btn-primary p-5" v-on:click="updateOrder"><i class="fas fa-sync"></i></button>
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


.qr-code canvas {
  position: relative;
}

.qr-code {
  max-width: 400px;
  width: 100%;
}

.blurred {
  filter: blur(5px);
}

</style>
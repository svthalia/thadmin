<template>
  <div class="card text-center mt-1 mb-3 user-select-none" v-if="order">
      <div v-bind:class="{ blurred: needsSync() }" style="transition: all 0.5s ease;">
        <div class="card-header font-oswald">
          <span class="order-description">{{order.getDescription()}}</span> • <span class="payment-amount">€{{order.getAmount()}}</span>
        </div>

        <div class="card-body">
          <p class="order-details">Order {{ order.getPK() }}</p>

          <div class="payment-info" v-if="order.isPaid()">
            <img class="payer-img" src="https://pbs.twimg.com/profile_images/1013449906151940096/0NnKwYgr_400x400.jpg">
            <button class="done" v-on:click="done">Done</button>
          </div>

          <qrcode-vue class="qr-code p-3 h-auto" v-bind:class="{ blurred: needsSync() }" v-else v-bind:value="order.getPaymentUrl()" v-bind:size="1024" renderAs="svg" level="M" />
        </div>

        <div class="card-footer" v-bind:class="{ blurred: needsSync() }">
          <p v-if="!order.isPaid()" class="text-uppercase">or register a</p>
          <p v-if="!order.isPaid()">
            <button class="btn btn-primary m-1"><i class="fas fa-coins"></i> Cash payment</button>
            <button class="btn btn-primary m-1"><i class="fas fa-credit-card"></i> Card payment</button>
          </p>
        </div>
      </div>
      <div class="position-absolute d-flex align-items-center justify-content-center w-100 h-100" v-if="!order.isPaid() && needsSync()">
        <button class="btn btn-primary p-5 d-block" v-if="order.hasProducts()" v-on:click="updateOrder"><i class="fas fa-sync"></i></button>
      </div>
      <p class="position-absolute bottom m-2" v-if="(order.hasProducts() || order.getPK()) && !order.isPaid()" v-on:click="deleteOrder"><i class="fas fa-trash"></i></p>
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
    deleteOrder: function () {
      this.$parent.reset();
    },
    updateOrder: function () {
      this.$parent.updateCurrentOrder();
    },
    needsSync: function () {
      return !this.order.synced;
    },
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
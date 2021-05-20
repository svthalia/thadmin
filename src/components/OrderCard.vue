<template>
  <div class="card text-center user-select-none shadow order-card border-0" v-if="order">
      <div v-bind:class="{ blurred: needsSync() }" style="transition: all 0.5s ease;">
        <div class="card-header">
          <div class="row m-0 p-0">
            <div class="col-10 p-0 m-0">
              <h6 class="m-0 text-left font-oswald font-weight-normal user-select-none"><span class="user-select-all" v-if="order.getDescription()">{{order.getDescription()}}</span><span v-else class="user-select-none invisible">No order</span></h6>
            </div>
            <div class="col-2 p-0 m-0" v-if="order && order.getAmount() > 0"><h6 class="text-right m-0 font-oswald font-weight-normal"><span class="user-select-all">€{{order.getAmount()}}</span></h6>
            </div>
          </div>
        </div>

        <div class="card-body pt-2 pb-1 px-2">
          <p class="m-0 order-id user-select-none">Order <span class="user-select-all">{{ order.getPK() }}</span></p>
        </div>

        <div class="card-body py-2 px-2 mb-3">
          <div class="px-5">
            <div v-if="order.getPayer()">
              <img class="image-fill" v-if="order.hasPayer()" :src="order.getPayerImage()" :alt="order.getPayer()">
              <img class="image-fill" v-else src="@/assets/images/anonymousUser.jpg" alt="anonymous user" >
            </div>
            <a v-else style="cursor: default" :href="order.getPaymentUrl()" target="_blank" onclick="return false;">
              <qrcode-vue class="image-fill" v-bind:class="{ blurred: needsSync() || !order.needsPayment() }" v-bind:value="order.getPaymentUrl()" v-bind:size="1024" renderAs="svg" level="M" />
            </a>
          </div>
        </div>

        <div class="card-footer p-1 p-md-2" v-bind:class="{ blurred: needsSync() }">
          <p class="m-0 p-1 user-select-none" style="cursor: default">
            <span class="user-select-none" v-if="order.isPaid() && order.hasPayer()">Paid by <span class="user-select-all">{{ order.getPayer() }}</span></span>
            <span class="user-select-none" v-else-if="order.isPaid()">Paid by anonymous user</span>
            <span class="user-select-none" v-else-if="!order.needsPayment()">No payment required</span>
            <span class="user-select-none" v-else>or register a</span>
          </p>
          <div class="m-0" v-if="!order.isPaid() && order.needsPayment()">
            <button class="btn btn-primary p-1 p-md-2 px-2 px-md-3 m-1 font-oswald"><i class="fas fa-coins"></i> Cash payment</button>
            <button class="btn btn-primary p-1 p-md-2 px-2 px-md-3 m-1 font-oswald"><i class="fas fa-credit-card"></i> Card payment</button>
          </div>
          <div class="m-0" v-else>
            <button class="btn btn-primary py-1 py-md-2 px-5 m-1 font-oswald" v-on:click="done">Done</button>
          </div>
        </div>
      </div>
      <div class="position-absolute d-flex align-items-center justify-content-center w-100 h-100" v-if="!order.isPaid() && needsSync()">
        <button class="btn btn-primary p-5 d-block shadow" v-if="order.hasProducts()" v-on:click="updateOrder"><i class="fas fa-sync"></i></button>
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
    done: function() {
      this.$parent.done();
    },
    updateOrder: function () {
      this.$parent.updateCurrentOrder();
    },
    needsSync: function () {
      return !this.order.synced;
    },
  },
}
</script>

<style scoped>
.order-id {
  font-size: 12px;
}
.qr-code canvas {
  position: relative;
}
.image-fill {
  height: 100%;
  width: 100%;
  max-width: 300px;
}
.blurred {
  filter: blur(10px);
}
</style>
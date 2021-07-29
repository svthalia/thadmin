<template>
  <router-link class="link-unstyled user-select-none" :to="{ name: 'Shift', params: { shiftId: shift.pk } }" :class="{ disabled: shiftDisabled(), shifthidden: shiftHidden() }" :disabled="shiftDisabled()">
      <div class="card-header">
        <h2 class="card-title font-oswald"><span v-if="shift.title">{{ shift.title }}</span><span v-else>Shift {{ shift.pk }}</span></h2>
        <p class="card-subtitle">{{ start_end_time() }}<span v-if="shift.title"> • Shift #{{ shift.pk }}</span></p>
      </div>
      <div class="card-body">
        <p class="font-weight-bold">Amount of orders: {{ shift.num_orders }}</p>
        <ul>
          <li v-for="(amount, product) in shift.product_sales">
            {{ product }}: {{ amount }}x
          </li>
        </ul>
      </div>
  </router-link>
</template>

<script>
import Shift from "@/models/shift.model";

export default {
  name: "ShiftCard",
  props: {
    shift: Shift,
  },
  data () {
    return {
      shiftDetailURL: process.env.VUE_APP_API_BASE_URI + "/admin/sales/shift/" + this.shift.pk + "/change/",
    }
  },
  methods: {
    start_end_time: function() {
      if (this.shift.start) {
        const start_date = new Date(this.shift.start);
        const end_date = new Date(this.shift.end);
        const today_date = new Date();
        if (start_date.getDate() === end_date.getDate() && start_date.getFullYear() === end_date.getFullYear() && start_date.getMonth() === end_date.getMonth()) {
          if (start_date.getDate() === today_date.getDate() && start_date.getFullYear() === today_date.getFullYear() && start_date.getMonth() === today_date.getMonth()) {
            return `${start_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} until ${end_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
          }
          return `${start_date.toLocaleDateString()}, ${start_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} until ${end_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }
        if (start_date.getDate() === today_date.getDate() && start_date.getFullYear() === today_date.getFullYear() && start_date.getMonth() === today_date.getMonth()) {
          return `${start_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} until ${end_date.toLocaleDateString()}, ${end_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }
        return `${start_date.toLocaleDateString()}, ${start_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} until ${end_date.toLocaleDateString()}, ${end_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      }
      return "";
    },
    shiftHidden: function () {
      return !this.shift.active
    },
    shiftDisabled: function () {
      const start = new Date(this.shift.start)
      const now = new Date()
      return start > now || this.shift.locked;
    }
  }
}
</script>

<style scoped>
.shifthidden {
  opacity: 0.75;
}
.disabled {
  opacity: 0.25;
  pointer-events: none;
}
.user-select-none {
  cursor: pointer;
}
</style>
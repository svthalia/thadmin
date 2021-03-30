<template>
  <router-link class="d-flex justify-content-center align-items-center link-unstyled" :to="{ name: 'Shift', params: { shiftId: shift.pk } }">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title font-oswald">Shift {{ shift.pk }}</h2>
        <p class="card-subtitle">From {{ start_end_time() }}</p>
      </div>
      <div class="card-body">
        #Orders: {{ shift.num_orders }}
      </div>
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
  methods: {
    start_end_time: function() {
      if (this.shift.start_date) {
        const start_date = new Date(this.shift.start_date);
        const end_date = new Date(this.shift.end_date);
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
  }
}
</script>

<style scoped>

</style>
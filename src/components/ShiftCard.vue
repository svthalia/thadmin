<template>
  <div class="card">
    <div class="card-header">
      <h2 class="card-title">Shift {{ shift.pk }}</h2>
      <p class="card-subtitle">From {{ shift.start_date }} to {{ shift.end_date }}</p>
    </div>
    <div class="card-body">
      #Orders: {{ shift.num_orders }}
    </div>
    <div class="card-footer">
      <router-link class="d-flex justify-content-center align-items-center" :to="{ name: 'Shift', params: { shiftId: shift.pk } }">
        <span class="mr-1">Go to shift #{{ shift.pk }}</span><i class="far fa-hand-point-right"></i>
      </router-link>
    </div>
  </div>

</template>

<script>
import Shift from "@/models/shift.model";

export default {
  name: "ShiftCard",
  props: {
    shift: Shift,
  }
}
</script>

<style scoped>

</style>
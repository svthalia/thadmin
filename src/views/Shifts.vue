<template>
  <div class="container">
    <h1 class="font-oswald mt-5 text-center">Currently active shifts</h1>
    <p class="text-center">Create a new shift via <a :href="createNewShiftURL" target="_blank">thalia.nu</a></p>
    <div v-if="shifts" class="mt-5 d-flex align-items-center">
      <ShiftCard v-for="shift in shifts" v-bind:shift="shift"></ShiftCard>
    </div>
  </div>
</template>

<script>
import SalesService from "@/common/sales.service";
import ShiftCard from "@/components/ShiftCard";

let salesService = new SalesService();

export default {
  name: 'Shifts Overview',
  components: {ShiftCard},
  data () {
    return {
      shifts: null,
      createNewShiftURL: process.env.VUE_APP_API_BASE_URI + "/admin/sales/shift/add/",
    }
  },
  mounted () {
    salesService.getShifts().then((shifts) => (this.shifts = shifts));
  },
}
</script>

<style scoped>

</style>

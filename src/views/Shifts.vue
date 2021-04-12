<template>
  <div class="container">
    <h1 class="font-oswald mt-5 text-center">Currently active shifts</h1>
    <p class="text-center">Create a new shift via <a :href="createNewShiftURL" target="_blank">thalia.nu</a></p>
    <div v-if="shifts" class="card-deck mt-5 d-flex align-items-stretch">
      <ShiftCard v-for="shift in shifts" v-bind:shift="shift" class="card shadow m-3"></ShiftCard>
    </div>
    <div v-else class="d-flex justify-content-center align-items-center">
      <Loader size="60px" background-color="#000000"></Loader>
    </div>
  </div>
</template>

<script>
import SalesService from "@/common/sales.service";
import ShiftCard from "@/components/ShiftCard";
import Loader from "@/components/Loader";

let salesService = new SalesService();

export default {
  name: 'Shifts Overview',
  components: {
    ShiftCard,
    Loader,
  },
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

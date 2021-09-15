<template>
  <div class="container user-select-none">
    <h1 class="font-oswald mt-5 text-center">Currently active shifts</h1>
    <p class="text-center">
      Create a
      <a :href="createNewShiftURL" target="_blank">new shift via thalia.nu</a>
      or
      <a :href="shiftsAdminURL" target="_blank">check out all shift details</a>
    </p>
    <div v-if="shifts" class="row mt-5 d-flex align-items-stretch">
      <div v-for="shift in shifts" class="col-12 col-md-6 col-lg-4 p-3">
        <ShiftCard v-bind:shift="shift" class="card shadow h-100"></ShiftCard>
      </div>
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
  name: "Shifts Overview",
  components: {
    ShiftCard,
    Loader,
  },
  data() {
    return {
      shifts: null,
      createNewShiftURL:
        process.env.VUE_APP_API_BASE_URI + "/admin/sales/shift/add/",
      shiftsAdminURL: process.env.VUE_APP_API_BASE_URI + "/admin/sales/shift/",
    };
  },
  methods: {
    fetchShifts: async function () {
      salesService.getShifts().then((shifts) => (this.shifts = shifts));
    },
  },
  mounted() {
    this.fetchShifts();
    this.fetchInterval = setInterval(this.fetchShifts, 10000);
  },
  unmounted() {
    clearInterval(this.fetchInterval);
  },
};
</script>

<style scoped></style>

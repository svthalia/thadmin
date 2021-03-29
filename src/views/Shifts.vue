<template>
  <div v-if="shifts" class="container mt-5 d-flex align-items-center">
    <ShiftCard v-for="shift in shifts" v-bind:shift="shift"></ShiftCard>
  </div>
</template>

<script>
import SalesService from "@/common/sales.service";
import ShiftCard from "@/components/ShiftCard";

let salesService = new SalesService();

export default {
  name: 'Shifts Overview',
  components: {ShiftCard},
  methods: {

  },
  data () {
    return {
      shifts: null,
    }
  },
  mounted () {
    salesService.getShifts().then((shifts) => (this.shifts = shifts));
  },
}
</script>

<style scoped>

</style>

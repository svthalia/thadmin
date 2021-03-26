<template>
</template>

<script>
import SalesService from "@/common/sales.service";

let salesService = new SalesService();

export default {
  name: 'Shifts Overview',
  methods: {

  },
  data () {

  },
  mounted () {
    salesService.getShift(parseInt(this.shiftId)).then((shift) => (this.shift = shift));
  },
}
</script>

<style scoped>

</style>

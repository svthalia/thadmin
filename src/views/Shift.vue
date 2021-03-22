<template>
  <div class="about">
    <h1>{{ shift }}</h1>
  </div>
</template>

<script type="ts">
import SalesService from "@/common/sales.service";

let salesService = new SalesService();

export default {
  name: 'About ',
  data() {
    return {
      shift: null,
    }
  },
  methods: {

  },
  mounted () {
    salesService.getOrderDetails("7a1a280b-63c0-4bee-bbad-b26984183cfe").then((orders) => {this.shift=orders});
  }
}
</script>

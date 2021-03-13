<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script type="ts">
import { AuthService } from "@/common/auth.service";

export default {
  name: 'About ',
  methods: {
    refresh() {
      AuthService.refreshTokens();
    }
  },
  mounted () {
    this.refresh();
  }
}
</script>

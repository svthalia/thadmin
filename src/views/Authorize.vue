<template>
  <div class="authorize">
    <h1>Authorization in progress...</h1>
    <p>You will be redirected shortly</p>
  </div>
</template>

<script type="ts">
import ApiService from "@/common/api.service";

export default {
  name: 'AuthorizationScreen',
  methods: {
    autorize() {
      let url = new URL(window.location.href);
      let code = url.searchParams.get("code");
      ApiService.requestAuthorizationToken(code).then(() => {
          window.location.href = "/";
      }).catch(() => {
        alert("Authorization failed, please try again...");
        window.location.href = "/";
      });
    }
  },
  mounted () {
      this.autorize();
    }
  }
</script>

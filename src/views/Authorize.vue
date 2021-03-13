<template>
  <div class="authorize">
    <h1>Authorization in progress...</h1>
    <p>You will be redirected shortly</p>
  </div>
</template>

<script type="ts">
import { AuthService } from "@/common/auth.service";

export default {
  name: 'AuthorizationScreen',
  methods: {
    autorize() {
      let url = new URL(window.location.href);
      let code = url.searchParams.get("code");
      AuthService.requestAuthorizationToken(code).then(() => {
          window.location.href = "/";
      }).catch(() => {
        alert("Authorization failed, please try again...");
        window.location.href = "/login";
      });
    }
  },
  mounted () {
      this.autorize();
    }
  }
</script>

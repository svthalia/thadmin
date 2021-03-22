<template>
  <div>
    <div v-if="authenticated">
      <button @click="logout()">Log out</button>
    </div>
    <div v-else>
      <button @click="login()">Log in</button>
    </div>
  </div>
</template>

<script>
import ApiService from "@/common/api.service";

export default {
  name: 'Authorization',
  data() {
    return {
      authenticated: ApiService.loggedIn(),
    }
  },
  methods: {
    logout() {
      ApiService.logOut();
      window.location.reload();
    },
    login() {
      window.location.href = ApiService.getAuthorizeRedirectURL();
    }
  },
  mounted() {
  },
}
</script>
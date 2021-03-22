<template>
  <div>
    <div v-if="authenticated">
      <p>Logged in</p>
      <button @click="logout()">Log out</button>
    </div>
    <div v-else>
      <p>Not logged in</p>
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
      authenticated: false,
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
    ApiService.loggedIn().then((result) => {this.authenticated = result}).catch(() => {this.authenticated = false});
  },
}
</script>
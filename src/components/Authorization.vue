<template>
  <div>
    <div v-if="authenticated">
      <button class="btn button-login" @click="logout()">Log out</button>
    </div>
    <div v-else>
      <button class="btn button-login logged-in" @click="login()">Log in</button>
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

<style scoped>
.button-login {
  background-color: #e62272;
  color: white;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0px;
  -moz-transition: 0.2s ease-in;
  -o-transition: 0.2s ease-in;
  -webkit-transition: 0.2s ease-in;
  -ms-transition: 0.2s ease-in;
  transition: 0.2s ease-in;
  border-radius: 0;
  text-transform: uppercase;
}
</style>
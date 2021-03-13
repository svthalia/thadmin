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
import { AuthService } from "@/common/auth.service";

export default {
  name: 'Authorization',
  methods: {
    logout() {
      AuthService.logOut();
      window.location.reload();
    },
    login() {
      AuthService.authorize();
    }
  },
  computed: {
    authenticated: function() {
      return AuthService.loggedIn();
    },
  },
}
</script>
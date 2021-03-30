<template>
  <nav class="navbar sticky-top site-header navbar-dark">
    <div class="container pl-0 pr-0">
      <div class="nav-link navbar-brand font-oswald pl-0 pr-0 mr-1">
        <router-link :to="{ name: 'Shifts' }" class="font-weight-bold link-unstyled">Thadmin</router-link> • <span class="font-weight-light">{{ currentTime }}</span>
      </div>
      <ul class="navbar-nav">
          <li class="nav-item">
            <a v-if="authenticated" href="#" class="nav-link d-flex justify-content-center align-items-center" @click="logout">
              <span class="mr-2">{{ username }}</span><i class="fas fa-sign-out-alt"></i>
            </a>
            <router-link v-else class="nav-link d-flex justify-content-center align-items-center" to="Login">
              <i class="fas fa-sign-in-alt"></i>
            </router-link>
          </li>
        </ul>
      </div>
  </nav>
</template>

<script>
import ApiService from "@/common/api.service";
import { mapState, mapGetters } from 'vuex';
import store from "@/store";

export default {
  name: 'Authorization',
  data() {
    return {
      currentTime: "",
      username: "username",
    }
  },
  methods: {
    zeroPad(n) {
      return (parseInt(n, 10) >= 10 ? "" : "0") + n;
    },
    time() {
      const now = new Date();
      this.currentTime = `${now.getHours()}:${this.zeroPad(
          now.getMinutes()
      )}:${this.zeroPad(now.getSeconds())}`;
    },
    logout() {
      store.dispatch("User/logout");
    }
  },
  computed: {
    ...mapGetters({
      authenticated: "User/isLoggedIn"
    })
  },
  mounted: function() {
    setInterval(this.time, 1000);
  }
}
</script>

<style scoped>
</style>
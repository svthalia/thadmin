<template>
  <nav
      class="navbar navbar-expand-md sticky-top site-header navbar-dark"
  >
    <div class="container">
      <div class="navbar-brand">{{ currentTime }}</div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a v-if="authenticated" href="#" class="nav-link d-flex justify-content-center align-items-center" @click="logout">
              <span class="mr-1">Log out</span><i class="fas fa-sign-out-alt"></i>
            </a>
            <router-link v-else class="nav-link d-flex justify-content-center align-items-center" to="Login">
              <span class="mr-1">Log in</span><i class="fas fa-sign-in-alt"></i>
            </router-link>
          </li>
        </ul>
      </div>
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
      currentTime: ""
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
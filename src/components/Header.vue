<template>
  <nav class="navbar sticky-top site-header navbar-dark">
    <div class="container pl-0 pr-0">
      <div class="nav-link navbar-brand font-oswald pl-0 pr-0 mr-1">
        <router-link v-if="authenticated" :to="{ name: 'Shifts' }" class="font-weight-bold link-unstyled">Thadmin</router-link>
        <router-link v-else :to="{ name: 'Index' }" class="font-weight-bold link-unstyled">Thadmin</router-link>
        • <span class="font-weight-light">{{ currentTime }}</span>
      </div>
      <ul class="navbar-nav">
          <li class="nav-item">
            <a v-if="authenticated" href="#" class="nav-link d-flex justify-content-center align-items-center" @click="logout">
              <img v-if="memberImageURL" :src="memberImageURL" alt="Member profile image" style="max-height: 1rem;" class="memberProfileImage mr-2"/>
              <span class="font-oswald mr-2">{{ username }}</span><i class="fas fa-sign-out-alt"></i>
            </a>
            <a v-else href="#" class="nav-link d-flex justify-content-center align-items-center" @click="startLogin">
              <i class="fas fa-sign-in-alt"></i>
            </a>
          </li>
        </ul>
      </div>
  </nav>
</template>

<script>
import SalesService from "@/common/sales.service";
import { mapGetters } from 'vuex';
import store from "@/store";
import ApiService from "@/common/api.service";

export default {
  name: 'Authorization',
  data() {
    return {
      currentTime: "",
      username: "",
      memberImageURL: null,
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
    },
    async startLogin() {
      await store.dispatch("User/newRandomState");
      await store.dispatch("User/store");
      window.location.href = ApiService.getAuthorizeRedirectURL();
    }
  },
  computed: {
    ...mapGetters({
      authenticated: "User/isLoggedIn"
    })
  },
  mounted () {
    setInterval(this.time, 1000);
    if (this.authenticated) {
      let apiService = new SalesService();
      apiService.getAuthorizedUserData().then(member =>
      {
        this.username = member.profile.short_display_name;
        this.memberImageURL = member.profile.photo.small;
      });
    }
  },
}
</script>

<style scoped>

.memberProfileImage {
  border-radius: 50%;
}

</style>
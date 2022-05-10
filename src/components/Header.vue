<template>
  <nav class="navbar sticky-top site-header navbar-dark user-select-none">
    <div class="container ps-0 pr-0">
      <div
        class="nav-link navbar-brand font-oswald ps-0 pe-0 me-1 user-select-none"
      >
        <router-link
          v-if="authenticated"
          :to="{ name: 'Shifts' }"
          class="fw-bold link-unstyled"
          >Thadmin</router-link
        >
        <router-link
          v-else
          :to="{ name: 'Index' }"
          class="fw-bold link-unstyled"
          >Thadmin</router-link
        >
        • <span class="fw-light">{{ currentTime }}</span>
      </div>
      <ul class="navbar-nav">
        <li class="nav-item">
          <a
            v-if="authenticated"
            href="#"
            class="nav-link d-flex justify-content-center align-items-center user-select-none"
            style="cursor: pointer"
            @click="logout"
          >
            <img
              v-if="memberImageURL"
              :src="memberImageURL"
              alt="Member profile image"
              style="max-height: 1rem"
              class="memberProfileImage me-2"
            />
            <span class="font-oswald me-2">{{ username }}</span
            ><i class="fas fa-sign-out-alt"></i>
          </a>
          <a
            v-else
            href="#"
            class="nav-link d-flex justify-content-center align-items-center"
            @click="startLogin"
          >
            <i class="fas fa-sign-in-alt"></i>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import SalesService from "@/common/sales.service";
import { mapGetters } from "vuex";
import store from "@/store";
import ApiService from "@/common/api.service";
import CryptoService from "@/common/crypto.service";

export default {
  name: "Authorization",
  data() {
    return {
      currentTime: "",
      username: "",
      memberImageURL: null,
    };
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
      await store.dispatch("User/newRandomChallenge");
      await store.dispatch("User/store");
      CryptoService.getSHA256(store.state.User.challenge).then(
        (codeChallenge) => {
          window.location.href = ApiService.getAuthorizeRedirectURL(
            store.state.User.stateKey,
            codeChallenge,
            true
          );
        }
      );
    },
    setUserProfileImage() {
      let apiService = new SalesService();
      apiService.getAuthorizedUserData().then((member) => {
        this.username = member.profile.short_display_name;
        this.memberImageURL = member.profile.photo.small;
      });
    },
  },
  computed: {
    ...mapGetters({
      authenticated: "User/isLoggedIn",
    }),
  },
  watch: {
    authenticated: function (val) {
      if (val) {
        this.setUserProfileImage();
      }
    },
  },
  mounted() {
    this.clockInterval = setInterval(this.time, 1000);
    if (this.authenticated) {
      this.setUserProfileImage();
    }
  },
  unmounted() {
    clearInterval(this.clockInterval);
  },
};
</script>

<style scoped>
.memberProfileImage {
  border-radius: 50%;
}
</style>

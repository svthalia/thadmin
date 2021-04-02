<template>
  <div class="container authorize mt-3 text-center">
    <h1 class="font-oswald">Authorization in progress...</h1>
    <p>You will be redirected shortly, if redirection fails, please click
      <router-link :to="{ name: 'Index' }">here</router-link></p>
    <div class="d-flex justify-content-center align-items-center">
      <Loader size="60px" background-color="#000000"></Loader>
    </div>
  </div>
</template>

<script type="ts">
import store from "@/store";
import router from "@/router";
import Loader from "@/components/Loader";

export default {
  name: 'AuthorizationScreen',
  components: {
    Loader
  },
  methods: {
    async authorize() {
      try {
        const url = new URL(window.location);
        if (url.searchParams.get("error")) {
          alert(`Authorization failed: ${url.searchParams.get("error")}`);
        }
        else {
          let hash_params = url.hash.replace("#", "").split("&");
          let hash_params_dict = {};
          hash_params.forEach((item) => {
            hash_params_dict[item.split(/=(.+)/)[0]] = item.split(/=(.+)/)[1]
          });
          await store.dispatch("User/login", {
            stateKey: hash_params_dict["state"] === undefined ? null : hash_params_dict["state"],
            accessToken: hash_params_dict["access_token"],
            expires: Date.now() + (parseInt(hash_params_dict["expires_in"]) * 1000),
            tokenType: hash_params_dict["tokenType"],
            scope: decodeURIComponent(hash_params_dict["scope"]).split(":")
          }).then(loggedIn => {
            if (!loggedIn) {
              alert("State token did not match, please try again...");
            } else {
              store.dispatch("User/store");
            }
          });
        }
      } catch (e) {
        alert("Authorization failed due to parsing error, please try again...");
      }
      await router.push({ name: "Shifts" });
    }
  },
  mounted () {
      this.authorize();
    }
  }
</script>

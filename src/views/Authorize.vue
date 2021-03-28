<template>
  <div class="authorize">
    <h1>Authorization in progress...</h1>
    <p>You will be redirected shortly</p>
  </div>
</template>

<script type="ts">
import store from "@/store";

export default {
  name: 'AuthorizationScreen',
  methods: {
    async authorize() {
      try {
        const url = new URL(window.location);
        let hash_params = url.hash.replace("#", "").split("&");
        let hash_params_dict = {};
        hash_params.forEach((item) => {
          hash_params_dict[item.split(/=(.+)/)[0]] = item.split(/=(.+)/)[1]
        });
        await store.dispatch("User/login", {
          stateKey: hash_params_dict["state"] === undefined ? null : hash_params_dict["state"],
          accessToken: hash_params_dict["access_token"],
          expires: Date.now() + hash_params_dict["expires_in"],
          tokenType: hash_params_dict["tokenType"],
          scope: decodeURIComponent(hash_params_dict["scope"]).split(":")}).then(loggedIn => {
          if (!loggedIn) {
            alert("State token did not match, please try again...");
          }
          else {
            store.dispatch("User/store");
          }
        });
      } catch (e) {
        alert("Authorization failed due to parsing error, please try again...");
      }
      window.location.href = "/";
    }
  },
  mounted () {
      this.authorize();
    }
  }
</script>

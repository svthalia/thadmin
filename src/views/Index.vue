<template>
  <div class="container text-center">
    <h1 class="font-oswald mt-5 text-center">Thadmin</h1>
    <div v-if="authenticated">
      You are currently logged in. Go to the
      <router-link :to="{ name: 'Shifts' }">Shifts view</router-link> to view or
      create a new shift.
    </div>
    <div v-else>
      <p>You are not logged in yet. Please login first.</p>
      <div class="d-flex justify-content-center align-items-center mt-5">
        <a
          href="#"
          class="login-btn btn btn-primary d-block"
          @click="startLogin"
        >
          Login with
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 374 375"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            class="d-inline-block w-auto"
          >
            <title>logo-t</title>
            <g
              id="Page-1"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g
                id="logo-t"
                transform="translate(-1.000000, 0.000000)"
                fill-rule="nonzero"
                fill="#ffffff"
              >
                <path
                  d="M196.929558,309.422964 C193.450765,306.717236 261.190596,373.104203 262.253561,373.973901 L196.929558,373.973901 C196.929558,373.973901 196.929558,309.422964 196.929558,309.422964 L196.929558,309.422964 Z"
                  id="hoekje_onder_3_"
                ></path>
                <path
                  d="M95.2714947,278.307093 L192.291167,181.28742 C192.291167,181.28742 192.194534,374.843599 192.097901,374.940233 L95.2714947,278.307093 Z"
                  id="Driehoek_onder_3_"
                ></path>
                <path
                  d="M140.012639,33.1488165 C172.38474,65.5209184 237.032311,130.458388 237.032311,130.458388 C237.032311,130.458388 139.916005,227.188162 140.012639,227.284795 L140.012639,33.1488165 Z"
                  id="maindriehoek_3_"
                ></path>
                <polygon
                  id="driehoekbovenmid_3_"
                  points="140.495804 27.5440943 276.748532 27.5440943 208.622168 95.2839255"
                ></polygon>
                <path
                  d="M70.4367777,27.5440943 L135.470881,27.5440943 L135.470881,91.6118662 C135.470881,91.6118662 70.7266771,91.6118662 70.4367777,91.6118662 L70.4367777,27.5440943 Z"
                  id="blokje_3_"
                ></path>
                <path
                  d="M65.8950201,91.7084993 C65.8950201,91.7084993 0.8609169,27.5440943 0.95755004,27.5440943 L65.8950201,27.6407275"
                  id="hoekjelinksboven_3_"
                ></path>
                <polygon
                  id="raarding_3_"
                  points="310.086965 0.48681514 374.154737 0.48681514 307.381237 67.2603149 243.313465 67.2603149"
                ></polygon>
              </g>
            </g></svg
        ></a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import ApiService from "@/common/api.service";
import CryptoService from "@/common/crypto.service";

export default {
  name: "Index",
  computed: {
    ...mapGetters({
      authenticated: "User/isLoggedIn",
    }),
  },
  methods: {
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
  },
};
</script>

<style scoped>
#logo-t {
  transition: color 0.15s ease-in-out;
}

.login-btn:hover * {
  fill: #e62272 !important;
}
</style>

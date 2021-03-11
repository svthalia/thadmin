<template>
  <div>
    <div v-if="authenticated">
      <p>Logged in</p>
    </div>
    <div v-else>
      <p>Not logged in</p>
    </div>
    <div><p>laksdjflaksdjf</p></div>
  </div>
</template>

<script>
  import { AuthService, AuthStatus } from "@/common/auth.service";
  import axios from "axios";

  export default {
    name: 'SplashScreen',
    props: {

    },
    data () {
      return {
        info: null
      }
    },
    computed: {
      authenticated: function() {
        console.log(AuthService.status);
        return AuthService.status === AuthStatus.SIGNED_IN;
      },
    },
    mounted () {
      axios
          .get('http://127.0.0.1:8000/api/v2/sales/')
          .then(response => (this.info = response))
          .catch(error => console.log(error))
    }
  }
</script>
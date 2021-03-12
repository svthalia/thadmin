<template>
  <div>
    <div v-if="authenticated">
      <p>Logged in</p>
    </div>
    <div v-else>
      <form @submit.prevent="submit">
        <input type="text" v-model="username"/>
        <input type="password" v-model="password"/>
        <button type="submit">
          Submit From Vue Property
        </button>
      </form>
    </div>
    <div><p>laksdjflaksdjf</p></div>
  </div>
</template>

<script>
  import axios from "axios";
  import { OAuthCredentials } from "@/common/token.service.ts";

  export default {
    name: 'SplashScreen',
    props: {

    },
    data () {
      return {
        username: "",
        password: ""
      }
    },
    methods: {
      submit() {
      }
    },
    computed: {
      authenticated: function() {
        return true;
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
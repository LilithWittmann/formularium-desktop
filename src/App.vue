<template>
  <v-app>
    <Login></Login>
  </v-app>
</template>

<script>
import Login from "./views/setup/Login";

export default {
  name: "App",

  components: {
    Login
  },

  data: () => ({
    //
  })
};
</script>

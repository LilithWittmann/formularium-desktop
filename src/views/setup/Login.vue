<template>
  <div class="login-container">
    <v-container fill-height>
      <v-row class="justify-center">
        <v-col :xl="6" :md="6" :sm="8" :xs="12" :cols="12">
          <v-sheet color="white" elevation="2" class="my-4 pa-6">
            <div v-if="showConfig">
              <h1>Formularium Setup</h1>

              <p>
                Please enter the configuration for your formularium instance
                provided by your formularium administrator.
              </p>
              <v-textarea
                v-model="configuration"
                label="configuration"
              ></v-textarea>
              <v-btn
                color="primary"
                raised
                block
                rounded
                class=" my-4"
                @click="setupOauth()"
                tile
                large
              >
                Setup
              </v-btn>
            </div>
            <div v-if="showSpinner" class="justify-center">
              <v-container fill-height>
                <v-row class="justify-center">
                  <v-progress-circular
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </v-row>
              </v-container>
            </div>
            <div v-if="showDone" class="justify-center">
              <h1>Setup Done</h1>
              <p>You are ready!</p>
              <v-btn
                color="primary"
                raised
                block
                rounded
                class=" my-4"
                @click="start()"
                tile
                large
              >
                Start!
              </v-btn>
            </div>
          </v-sheet></v-col
        ></v-row
      >
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      configuration: "",
      showConfig: true,
      showSpinner: false,
      showDone: false,
      token: {}
    };
  },
  methods: {
    setupOauth() {
      this.showConfig = false;
      this.showSpinner = true;
      var credentials = JSON.parse(this.configuration);

      window.api.oauth
        .setupOauth(
          credentials.authURL,
          credentials.apiURL,
          credentials.clientID
        )
        .then(result => {
          console.log(result);
          window.api.oauth.getToken().then(result => {
            console.log("TOKEN");
            console.log(result);
            this.showSpinner = false;
            this.showDone = true;
            this.token = result;
          });
        });
    },
    start() {
      console.log("router?");
      this.$router.push({ name: "PGP" });
    }
  }
};
</script>

<style scoped lang="scss">
.login-container {
  background-color: #424242;
  height: 100%;
}
</style>

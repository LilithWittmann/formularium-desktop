<template>
  <div class="login-container">
    <v-container fill-height>
      <v-row class="justify-center">
        <v-col :xl="6" :md="6" :sm="8" :xs="12" :cols="12">
          <v-sheet color="white" elevation="2" class="my-4 pa-6">
            <h1>Formularium Einrichtung</h1>
            <p>
              Bitte gib die URL deiner Formularium-Instanz ein. Diese erhältst
              Du von deinem Administrator.
            </p>
            <v-text-field
              v-model="instanceURL"
              label="URL"
              type="url"
            ></v-text-field>
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
              Weiter
            </v-btn>
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
      instanceURL: ""
    };
  },
  methods: {
    setupOauth() {
      window.api.oauth
        .setupOauth(
          "https://formulariumapi.verdrusssache.de/oauth",
          "Xhaz9qWvlFkhXRJEXvvsUMHqWvIcYKIhMg8qdvFL"
        )
        .then(result => {
          console.log(result);
          window.api.oauth.getToken().then(result => {
            console.log("TOKEN");
            console.log(result);
          });
        });
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

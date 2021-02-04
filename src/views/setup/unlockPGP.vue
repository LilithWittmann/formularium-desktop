<template>
  <div class="pgp-container">
    <v-container fill-height>
      <v-row class="justify-center">
        <v-col :xl="6" :md="6" :sm="8" :xs="12" :cols="12">
          <v-sheet color="white" elevation="2" class="my-4 pa-6">
            <div v-if="showConfig">
              <h1>Login</h1>
              <v-text-field
                v-model="loginPassword"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show2 ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                counter
                @click:append="show2 = !show2"
              ></v-text-field>
              <v-btn
                color="primary"
                raised
                block
                rounded
                class=" my-4"
                @click="login()"
                tile
                large
              >
                Login
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
            </div> </v-sheet></v-col
      ></v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "unlockPGP",
  data() {
    return {
      showConfig: true,
      showSpinner: false,
      loginPassword: "",
      show2: false
    };
  },

  methods: {
    login() {
      console.log("start import");
      this.showSpinner = true;
      this.showConfig = false;
      let that = this;
      window.api.pgp.loadKey(this.loginPassword).then(function(key) {
        console.log(key);
        that.showSpinner = false;
        that.$router.push({ name: "Dashboard" });
      });
    }
  }
};
</script>

<style scoped>
.pgp-container {
  background-color: #424242;
  height: 100%;
}
</style>

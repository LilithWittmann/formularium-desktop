<template>
  <div class="pgp-container">
    <v-container fill-height>
      <v-row class="justify-center">
        <v-col :xl="6" :md="6" :sm="8" :xs="12" :cols="12">
          <v-sheet color="white" elevation="2" class="my-4 pa-6">
            <div v-if="showConfig">
              <h1>PGP-Encryption Setup</h1>

              <p>
                There are two options how to setup your pgp encryption. You can
                either import an existing formularium pgp key or create a new
                one.
              </p>
              <h2>Import existing Key</h2>
              <p>
                Note: This key must be already registered for you in
                formularium.
              </p>
              <v-textarea v-model="publicKey" label="Public Key"></v-textarea>
              <v-textarea v-model="privateKey" label="Private Key"></v-textarea>
              <v-text-field
                v-model="importPassword"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                counter
                @click:append="show1 = !show1"
              ></v-text-field>
              <v-btn
                color="primary"
                raised
                block
                rounded
                class=" my-4"
                @click="importKey()"
                tile
                large
              >
                Import PGP-Key
              </v-btn>
              <h2>Create a new PGP-Key</h2>
              <v-text-field
                v-model="createPassword"
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
                @click="createKey()"
                tile
                large
              >
                Create new PGP-Key
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
              <h1>PGP-Key created!</h1>
              <p>
                If you created a new key: Please contact your formularium admin
                and ask them to approve your newly added key!
              </p>
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
  name: "setupPGP",
  data() {
    return {
      privateKey: "",
      publicKey: "",
      showConfig: true,
      showSpinner: false,
      showDone: false,
      createPassword: "",
      importPassword: "",
      show1: false,
      show2: false
    };
  },

  methods: {
    createKey() {},
    importKey() {
      console.log("start import");
      this.showSpinner = true;
      this.showConfig = false;
      console.log(this.importPassword);
      let that = this;
      window.api.pgp
        .importKey(this.publicKey, this.privateKey, this.importPassword)
        .then(function(key) {
          console.log(key);
          that.showDone = true;
          that.showSpinner = false;
        });
    },
    start() {
      console.log("router?");
      console.log({ name: "Home" });
      this.$router.push({ name: "Dashboard" });
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

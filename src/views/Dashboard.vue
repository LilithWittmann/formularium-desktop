<template>
  <div v-if="allFormSubmissions">
    <v-row>
      <v-col cols="3" class="submissions-list">
        <v-list two-line style="max-height: 100vh;" class="overflow-y-auto">
          <v-list-item-group v-model="selected" active-class="pink--text">
            <template v-for="(item, index) in allFormSubmissions.edges">
              <v-list-item :key="item.node.id" class="submission-item">
                <template>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      item.node.form.name
                    }}</v-list-item-title>

                    <v-list-item-subtitle
                      class="text--primary"
                      v-text="item.node.submittedAt"
                    ></v-list-item-subtitle>

                    <v-list-item-subtitle
                      v-text="item.subtitle"
                    ></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-action-text
                      v-text="item.action"
                    ></v-list-item-action-text>
                  </v-list-item-action>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < allFormSubmissions.edges.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col
        cols="9"
        :set="(submission = allFormSubmissions.edges[selected].node)"
      >
        <h1>{{ submission.form.name }}</h1>
        <br />
        {{ submission.data }}
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    console.log(window.api.pgp.getPublicKey());
    return {
      selected: 0
    };
  },

  apollo: {
    allFormSubmissions: {
      query() {
        return require("../graphql/allFormSubmissions.gql");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.submissions-list {
  border-right: solid 1px rgba(0, 0, 0, 0.12);
  padding: 0px;

  .submission-item {
    padding-left: 20px;
    padding-right: 2px;
  }
}
</style>

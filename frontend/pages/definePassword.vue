<template>
  <div class="auth flexHVcenter">
    <img alt="square logo" src="~/assets/img/logo500.png" />
    <hr class="middleHR"/>
    <div class="content">
      <h1>Define a new password</h1>
      <label for="newPassword">Your new password :</label>
      <input type="text" name="newPassword" v-model.lazy="toSend.password" />
      <v-btn class="verify" @click="modifyPassword">
        <p class="v-btn-content">Verify</p>
      </v-btn>
    </div>
    <div class="errMessages">
      <v-expand-transition v-for="(msg, index) in msgErr" :key="index">
        <v-alert dense dismissible elevation="8" type="warning">
          <p style="text-transform: uppercase;">{{msg}}</p>
        </v-alert>
      </v-expand-transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'newPassword',
  layout: 'empty',
  data(): any {
    return {
      toSend: {
        password: "" as string,
      },
      msgErr: [],
    };
  },
  methods: {
    modifyPassword(): void {
      if (this.toSend.password)
      {
        this.$axios
        .patch('/api/user/settings', this.toSend ,  { withCredentials: true })
        .then((response: any): void => {
          this.$router.push({ name: 'login' })
          console.log("PASSWORD CHANGED");
        })
        .catch((error: any): void => {
          let errorTab = error.response.data.message;
          console.log(errorTab);
          setTimeout(() => {
            this.msgErr = (typeof errorTab == "string") ? [errorTab] : errorTab;}, 600) 
        })
      }
    },
  },
});
</script>

<style scoped lang="scss" src="./definePassword.scss">
</style>
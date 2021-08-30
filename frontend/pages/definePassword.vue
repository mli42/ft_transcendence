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
    };
  },
  methods: {
    modifyPassword(): void {
      if (this.toSend.password)
      {
        this.$axios
        .patch('/api/user/settings', this.toSend)
        .then((response: any): void => {
          this.$router.push({ name: 'login' })
          this.$mytoast.succ('Password changed');
        })
        .catch(this.$mytoast.defaultCatch);
      }
    },
  },
});
</script>

<style scoped lang="scss" src="./authentification.scss">
</style>

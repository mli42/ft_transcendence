<template>
  <div class="auth flexHVcenter">
    <img alt="square logo" src="~/assets/img/logo500.png" />
    <hr class="middleHR"/>
    <div class="content flexHVcenter flexAlignCol">
      <h1>Two Factor Authentication</h1>
      <div>
        <label for="code2FA">Code :</label>
        <input id="code2FA" type="text" name="code"
        v-model.lazy="secretCode" @keyup.enter="verifSecret" />
      </div>
      <v-btn class="verify" @click="verifSecret">
        <p class="v-btn-content dbtxt">Verify</p>
      </v-btn>
      <v-btn class="logoutBtn" @click="this.$user.logout">
        <p>Logout</p>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'auth',
  layout: 'empty',
  head(): object {
    return {
      title: "2FA Code" as String,
    };
  },
  data(): any {
    return {
      secretCode: '' as string,
    };
  },
  methods: {
    verifSecret(): void {
      if (this.secretCode.length == 0) {
        this.$mytoast.info('Code is empty');
        return ;
      }
      this.$axios
      .post(`/api/auth/2fa/${this.secretCode}`)
      .then((response: any): void => {
        const isOK: boolean = (response.data === 'True');

        if (isOK) {
          this.$router.push('/')
          this.$mytoast.succ('Authenticated');
        } else {
          this.$mytoast.err('Wrong code');
        }
      })
      .catch(this.$mytoast.defaultCatch);
    },
  },
});
</script>

<style scoped lang="scss" src="./authentification.scss">
</style>

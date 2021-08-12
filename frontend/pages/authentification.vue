<template>
  <div class="auth flexHVcenter">
    <img alt="square logo" src="~/assets/img/logo500.png" />
    <hr class="middleHR"/>
    <div class="content">
      <h1>Two-factor Authentification</h1>
      <label for="code">Code :</label>
      <input type="text" name="code" v-model.lazy="secretCode" />
      <v-btn class="verify" @click="verifSecret">
        <p class="v-btn-content">Verify</p>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'auth',
  layout: 'empty',
  data(): any {
    return {
      secretCode: '' as string,
    };
  },
  methods: {
    verifSecret(): void{
      this.$axios
      .get(`/api/auth/2fa/${this.secretCode}`)
      .then((response: any): void =>{
        this.$router.push({ name: 'login' })
        console.log("SECRET SUCCESSE");
      })
      .catch((error: any): void =>{
        console.log("SECRET FAILURE");
      });
    },
  },
});
</script>

<style scoped lang="scss" src="./authentification.scss">
</style>
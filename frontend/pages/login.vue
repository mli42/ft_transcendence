<template>
  <div class="loginMain flexHVcenter">
    <img class="imgWave" src="~/assets/img/vague.svg" />

    <div class="content">
      <div class="contentCol">
        <h1 class="contentTitle">Login</h1>
        <form>
          <LoginInput name="Username/Email" v-model="logInfos.id"></LoginInput>
          <LoginInput name="Password" v-model="logInfos.password" :isPassword="true"></LoginInput>
          <v-btn block elevation="2" class="logOpt" @click.prevent="loginSubmit">
            <p class="v-btn-content">Login</p>
          </v-btn>
        </form>
        <hr class="leftHR" />
        <v-btn block elevation="2" class="logOpt" :href="auth42URL">
          <p class="v-btn-content">Connect with 42</p>
        </v-btn>
      </div>

      <hr class="middleHR" />

      <div class="contentCol">
        <h1 class="contentTitle">Sign-up</h1>
        <form>
          <LoginInput name="Username" v-model="signInfos.username"></LoginInput>
          <LoginInput name="Email" v-model="signInfos.email"></LoginInput>
          <LoginInput name="Password" v-model="signInfos.password" :isPassword="true" :idNb=1></LoginInput>
          <LoginInput name="Confirm password" v-model="signInfos.password2" :isPassword="true"></LoginInput>
          <v-btn block elevation="2" class="logOpt" @click.prevent="signUp">
            <p class="v-btn-content">Sign up</p>
          </v-btn>
        </form>
      </div>
    </div>

    <div class="errMessages">
      <v-expand-transition v-for="(msgErr, index) in this.$store.state.auth.errorMsg" :key="index">
        <v-alert dense dismissible elevation="8" type="warning">
          <p style="text-transform: uppercase;">{{msgErr}}</p>
        </v-alert>
      </v-expand-transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import loginInfos from '~/types/loginInfos';
import signUpInfos from '~/types/signUpInfos';

export default Vue.extend({
  name: 'login',
  layout: 'empty',
  data() {
    return {
      logInfos: new loginInfos() as loginInfos,
      signInfos: new signUpInfos() as signUpInfos,
    };
  },
  methods: {
    loginSubmit(): void {
      this.$store.dispatch('auth/login', this.logInfos);
    },
    signUp() {
      this.$store.dispatch('auth/signUp', this.signInfos);
    },
  },
  computed: {
    auth42URL(): string {
      return (`${this.$axios.defaults.baseURL}/api/auth/42/login`);
    },
  },
});
</script>

<style scoped lang="scss" src="./login.scss">
</style>

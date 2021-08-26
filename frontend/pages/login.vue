<template>
  <div class="loginMain flexHVcenter">
    <img class="imgWave" src="~/assets/img/vague.svg" />

    <div class="content">
      <div class="contentCol">
        <h1 class="contentTitle">Login</h1>
        <form>
          <LoginInput name="Username/Email" v-model="logInfos.id" @keyup.enter.native="loginSubmit"></LoginInput>
          <LoginInput name="Password" v-model="logInfos.password" :isPassword="true" @keyup.enter.native="loginSubmit"></LoginInput>
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
          <LoginInput name="Username" v-model="signInfos.username" @keyup.enter.native="signUp"></LoginInput>
          <LoginInput name="Email" v-model="signInfos.email" @keyup.enter.native="signUp"></LoginInput>
          <LoginInput name="Password" v-model="signInfos.password" :isPassword="true" :idNb=1 @keyup.enter.native="signUp"></LoginInput>
          <LoginInput name="Confirm password" v-model="signInfos.password2" :isPassword="true" @keyup.enter.native="signUp"></LoginInput>
          <v-btn block elevation="2" class="logOpt" @click.prevent="signUp">
            <p class="v-btn-content">Sign up</p>
          </v-btn>
        </form>
      </div>
    </div>

    <LoadingModale v-if="this.$store.getters['auth/getStatus'] !== 'idle'"
    label="Logging in"></LoadingModale>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import loginInfos from '~/types/loginInfos';
import signUpInfos from '~/types/signUpInfos';

export default Vue.extend({
  name: 'login',
  layout: 'empty',
  head(): object {
    return {
      title: "Login" as String,
    };
  },
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

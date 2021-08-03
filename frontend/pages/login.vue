<template>
  <div class="loginMain flexHVcenter">
    <img class="imgWave" src="~/assets/img/vague.svg" />

    <div class="content flexHVcenter">
      <div class="contentCol">
        <h1 class="contentTitle">Login</h1>
        <br>
        <form>
          <LoginInput name="Username/Email" v-model="logEmail"></LoginInput>
          <LoginInput name="Password" v-model="logPass" :isPassword="true"></LoginInput>
          <v-btn block elevation="2" class="logOpt" @click.prevent="loginSubmit">
            <p class="v-btn-content">Login</p>
          </v-btn>
        </form>
        <hr class="leftHR" />
        <v-btn block elevation="2" class="logOpt" @click.prevent="login42">
          <p class="v-btn-content">Connect with 42</p>
        </v-btn>
      </div>

      <div class="contentCol">
        <h1 class="contentTitle">Sign-up</h1>
        <form>
          <LoginInput name="Username" v-model="signUsername"></LoginInput>
          <LoginInput name="Email" v-model="signEmail"></LoginInput>
          <LoginInput name="Password" v-model="signPass" :isPassword="true" :idNb=1></LoginInput>
          <LoginInput name="Confirm password" v-model="signPass2" :isPassword="true"></LoginInput>
          <v-btn block elevation="2" class="logOpt" @click.prevent="signUp">
            <p class="v-btn-content">Sign up</p>
          </v-btn>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'login',
  layout: 'empty',
  data() {
    return {
      logEmail: '' as String,
      logPass: '' as String,
      signUsername: '' as String,
      signEmail: '' as String,
      signPass: '' as String,
      signPass2: '' as String,
    };
  },
  methods: {
    loginSubmit(): void {
      console.log(this.logEmail, this.logPass);
    },
    login42(): void {
      console.log("Logging with 42");
    },
    signUp(): void {
      console.log(this.signUsername, this.signEmail, this.signPass, this.signPass2);
    },
  },
});
</script>

<style scoped lang="scss" src="./login.scss">
</style>

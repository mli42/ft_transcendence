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
    };
  },
  methods: {
    loginSubmit(): void {
      console.log(this.logEmail, this.logPass);
    },
    login42(): void {
      console.log("Logging with 42");
    },
  },
});
</script>

<style scoped lang="scss" src="./login.scss">
</style>

<template>
  <div class="loginMain flexHVcenter">
    <img class="imgWave" src="~/assets/img/vague.svg" />

    <div class="content flexHVcenter">
      <div class="contentCol">
        <h1>Login</h1>
        <br>
        <form>
          <LoginInput name="Username/Email" v-model="logEmail"></LoginInput>
          <LoginInput name="Password" v-model="logPass" :isPassword="true"></LoginInput>
        </form>
      </div>
      <div class="contentCol">
        <h1>Sign-up</h1>
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
  },
});
</script>

<style scoped lang="scss" src="./login.scss">
</style>

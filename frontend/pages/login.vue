<template>
  <div class="loginMain flexHVcenter">
    <img class="imgWave" src="~/assets/img/vague.svg" />

    <div class="content flexHVcenter">
      <div class="contentCol">
        <h1>Login</h1>
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
    };
  },
  methods: {
  },
});
</script>

<style scoped lang="scss" src="./login.scss">
</style>

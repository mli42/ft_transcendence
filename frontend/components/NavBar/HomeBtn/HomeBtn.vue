<template>
  <NuxtLink class="homebtn pg-button" to="/">
    <img class="logoHomeBtn" src="~/assets/img/logo500.png" alt="pong-logo">
    <p class="txtHomeBtn">DELUXE PONG</p>
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HomeBtn',
  data() {
    return {
    };
  },
});
</script>

<style scoped lang="scss" src="./HomeBtn.scss">
</style>

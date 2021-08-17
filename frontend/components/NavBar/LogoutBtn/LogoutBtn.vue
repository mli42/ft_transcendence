<template>
  <div class="pg-button bannerbtn" @click="logOut">
    <Iconify class="logoutIcone" :iconName="this.icone"></Iconify>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LogoutBtn',
  props: ['icone', 'logOut'],
});
</script>

<style scoped lang="scss" src="../RoundBtn/RoundBtn.scss">
</style>

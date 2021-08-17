<template>
  <NuxtLink class="pg-button bannerbtn" :to="route">
    <Avatar :user="this.$store.state.user"></Avatar>
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ProfileBtn',
  props: ['route'],
});
</script>

<style scoped lang="scss" src="../RoundBtn/RoundBtn.scss">
</style>

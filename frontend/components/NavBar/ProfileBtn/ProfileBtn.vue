<template>
  <NuxtLink class="pg-button bannerbtn" :to="route">
    <img style="border-radius: 50%; width:40px; height: auto;" :src="avatarURL" alt="my avatar">
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ProfileBtn',
  computed: {
    avatarURL(): string {
      return (`${this.$store.state.avatarURL}`);
    },
  },
  props: ['route'],
});
</script>

<style scoped lang="scss" src="../RoundBtn/RoundBtn.scss">
</style>

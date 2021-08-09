<template>
  <NuxtLink class="pg-button bannerbtn" :to="route">
    <Iconify :class="imgClass" :iconName="this.icone"></Iconify>
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'RoundBtn',
  computed: {
    imgClass(): object {
      return {imgIcone: true, msgIcone: (this.route == '/chat')}
    }
  },
  props: ['route', 'icone'],
});
</script>

<style scoped lang="scss" src="./RoundBtn.scss">
</style>

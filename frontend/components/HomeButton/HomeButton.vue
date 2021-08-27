<template>
  <NuxtLink class="homeButtonMain flexHVcenter" :to="linkTo">
    <Iconify :class="imgClass" :iconName="iconName" param="blue" ></Iconify>
    <p>{{text}}</p>
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HomeButton',
  computed: {
    imgClass(): object {
      return { imgIcon: true };
    }
  },
  props: ['iconName', 'linkTo', 'text'],
});
</script>

<style scoped lang="scss" src="./HomeButton.scss">
</style>

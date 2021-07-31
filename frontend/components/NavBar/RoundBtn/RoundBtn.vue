<template>
  <NuxtLink class="pg-button bannerbtn" :to="route">
    <img alt="icone img" :src="imgURL" :class="imgClass">
  </NuxtLink>
</template>

<script lang="ts">
export default {
  name: 'RoundBtn',
  data(): any {
    return {
      imgURL: `https://api.iconify.design/${this.icone}.svg` as string,
    };
  },
  computed: {
    imgClass(): object {
      return {imgIcone: true, msgIcone: (this.route == '/chat')}
    }
  },
  components: {
  },
  props: ['route', 'icone'],
}
</script>

<style scoped lang="scss" src="./RoundBtn.scss">
</style>

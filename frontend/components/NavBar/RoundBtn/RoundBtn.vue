<template>
  <NuxtLink class="pg-button bannerbtn" :to="route">
    <img alt="icone img" :src="imgURL" :class="imgClass">
  </NuxtLink>
</template>

<script lang="ts">
export default {
  name: 'RoundBtn',
  data(): any {
    const _this: any = this;
    return {
      imgURL: `https://api.iconify.design/${_this.icone}.svg` as string,
    };
  },
  computed: {
    imgClass(): object {
      const _this: any = this;
      return {imgIcone: true, msgIcone: (_this.route == '/chat')}
    }
  },
  components: {
  },
  props: ['route', 'icone'],
}
</script>

<style scoped lang="scss" src="./RoundBtn.scss">
</style>

<template>
  <v-app id="errMain">
    <div class="errMain flexAlignCol">
    <h1>{{ errMessage }}</h1>
    <img alt="Sad cat" class="funImg" src="https://images.unsplash.com/photo-1525785967371-87ba44b3e6cf">
    <NuxtLink to="/">
      <p class="homeLink">Return to home page</p>
    </NuxtLink>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head (): object {
    return {
      title: this.errMessage,
    };
  },
  computed: {
    errMessage(): string {
      return this.error.statusCode === 404 ? '404 Not Found' : (this?.error?.message || 'An error occurred');
    },
  },
});
</script>

<style scoped lang="scss" src="./error.scss">
</style>

<template>
  <img :alt="`iconify icon: ${this.iconName}`" :src="imgURL" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Iconify',
  computed: {
    imgURL(): string {
      return require(`~/assets/iconify/${this.iconName}.svg`);
    },
  },
  props: {
    iconName: {
      type: String,
      required: true,
    },
    param: {
      type: String,
      required: false,
      default: '',
    },
  },
});
</script>

<style scoped>
</style>

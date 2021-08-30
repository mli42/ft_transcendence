<template>
  <img :alt="`iconify icon: ${this.iconName}`" :src="imgURL" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Iconify',
  computed: {
    imgURL(): string {
      let finalIconName = this.iconName;

      if (this.param)
        finalIconName += `-${this.param}`;
      return require(`~/assets/iconify/${finalIconName}.svg`);
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

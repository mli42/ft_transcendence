<template>
  <img :alt="`iconify icon: ${this.iconName}`" :src="imgURL" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Iconify',
  computed: {
    imgURL(): string {
      let res: string = `https://api.iconify.design/${this.iconName}.svg`;

      if (this.param)
        res = `${res}?${this.param}`;
      return (res);
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

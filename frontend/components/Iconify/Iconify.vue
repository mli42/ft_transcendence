<template>
  <img :alt="`iconify icon: ${this.iconName}`" :src="imgURL" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Iconify',
  computed: {
    imgURL(): string {
      let color: string;
      if (this.iconName == "lucide:log-out")
        color = "B30438";
      else
        color = "1B2636";
      let res: string = `https://api.iconify.design/${this.iconName}.svg?color=%23${color}`;

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

<style scoped>
img {
  fill: red;
}
</style>

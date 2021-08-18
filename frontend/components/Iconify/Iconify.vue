<template>
  <img :alt="`iconify icon: ${this.iconName}`" :src="imgURL" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Iconify',
  computed: {
    imgURL(): string {
      let res: string = `https://api.iconify.design/${this.iconName}.svg?`;
      let param: string = this.param;
      let color: string;

      if (!param.includes('color')) {
        if (this.iconName == "lucide:log-out")
          color = "B30438";
        else
          color = "1B2636";
        param = `color=%23${color}&${param}`;
      }
      if (param.length != 0)
        res += param;
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

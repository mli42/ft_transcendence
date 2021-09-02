<template>
  <div class="containerMain" :style="mainStyle">
    <p>{{label}}</p>
    <hr />
    <div class="innerMain flexAlignCol" :style="innerStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'overflowContainer',
  data() {
    return {
      mainStyle: {
        width: this.width,
        height: this.height,
      },
      innerStyle: {
        height: this.innerHeight,
      },
    };
  },
  props: ['label', 'width', 'height', 'innerHeight'],
});
</script>

<style scoped lang="scss" src="./overflowContainer.scss">
</style>

<template>
  <div class="containerMain">
    <p>{{label}}</p>
    <hr />
    <div class="innerMain flexAlignCol" :style="mainStyle">
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
        'min-height': this.heightMin ?? 0,
        'max-height': this.heightMax,
      },
    };
  },
  props: ['label', 'width', 'heightMin', 'heightMax'],
});
</script>

<style scoped lang="scss" src="./overflowContainer.scss">
</style>

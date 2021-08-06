<template>
  <div>
    <v-overlay></v-overlay>

    <div class="useWholePage loadingContent">
      <h1 class="loadingLabel">{{labelMsg}}</h1>
      <v-progress-circular class="progress-circle"
        indeterminate size="64" width="7"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LoadingModale',
  data() {
    return {
      count: 0 as number,
      dots: [] as string[],
    };
  },
  computed: {
    labelMsg(): string {
      let resetData: Function = () => { this.count = 0; this.dots = []; };
      let updateLabelMsg: Function = () => { this.dots.push('.'); };

      setTimeout(() => { (this.count++ == 3) ? resetData() : updateLabelMsg() }, 1000);
      return (this.label + this.dots.join(''));
    },
  },
  props: ['label'],
});
</script>

<style scoped lang="scss" src="./LoadingModale.scss">
</style>

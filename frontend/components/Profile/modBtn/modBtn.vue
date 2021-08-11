<template>
  <div class="modBtnMain flexHVcenter"
    @click="$emit('toggled')">
    <Iconify :iconName="icon"></Iconify>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'modBtn',
  props: ['icon'],
});
</script>

<style scoped lang="scss" src="./modBtn.scss">
</style>

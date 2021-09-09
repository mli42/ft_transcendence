<template>
  <v-btn class="modBtnMain flexHVcenter" fab
    @click="$emit('toggled')">
    <Iconify :iconName="icon"></Iconify>
  </v-btn>
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

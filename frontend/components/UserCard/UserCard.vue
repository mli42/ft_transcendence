<template>
  <div :class="{ red : selected }" @click="selected = true">
      <img src="~/assets/img/avatar.jpeg">
      <p>{{ name }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'userCard',
  layout: 'default',
  data(): any {
    return {
        selected: false as boolean,
    }
  },
  methods: {
  },
  props: ['name', 'imgsrc'],
});
</script>

<style scoped lang="scss" src="./UserCard.scss">
</style>

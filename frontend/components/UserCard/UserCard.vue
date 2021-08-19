<template>
  <div :class="{ red : selected }" @click="selected = true; joinChannel(index)">
      <img src="~/assets/img/chatbubble.svg">
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
  props: ['name', 'joinChannel', 'index'],
});
</script>

<style scoped lang="scss" src="./UserCard.scss">
</style>

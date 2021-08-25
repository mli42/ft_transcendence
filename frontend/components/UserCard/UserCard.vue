<template>
  <div :class="{ red : selected }" @click="joinChannel(index), selected = true">
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
  computed: {
    checkselected(): void{
      if (this.name === this.channelName)
        this.selected = true;
      else
        this.selected = false;
    }
  },
  props: ['name', 'joinChannel', 'index'],
});
</script>

<style scoped lang="scss" src="./UserCard.scss">
</style>

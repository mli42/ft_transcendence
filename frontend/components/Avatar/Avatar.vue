<template>
  <img :src="avatarURL"
  style="width: 100%; height: 100%; border-radius: 50%;"
  :alt="`${user.username}'s profile picture`" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Avatar',
  data() {
    return {
      avatarURL: `${this.$store.state.avatarBaseURL}/${this.user.userId}` as string,
    };
  },
  props: ['user'],
});
</script>

<style scoped lang="scss">
</style>

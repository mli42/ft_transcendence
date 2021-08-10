<template>
  <div class="usernameMain useWholePage">
    <div class="usernameContent">
      <Profile :username="this.username"></Profile>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  async asyncData({ params }) {
    const username = params.username;
    return { username };
  },
});
</script>

<style scoped lang="scss" src="./_username.scss">
</style>

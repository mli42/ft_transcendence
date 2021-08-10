<template>
  <div class="usernameMain useWholePage">
    <div class="usernameContent">
      <Profile v-if="this.user !== undefined" :user="this.user"></Profile>
      <NotExistProfile v-else :username="this.username"></NotExistProfile>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  async asyncData({ params, app }) {
    const username: string = params.username;
    const user: any = await app.$axios.get(`/api/user/userInfo?username=${username}`)
    .then((res: any) => res.data)
    .catch(() => undefined);
    return { username, user };
  },
});
</script>

<style scoped lang="scss" src="./_username.scss">
</style>

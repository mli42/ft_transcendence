<template>
  <div class="usernameMain">
    <div class="usernameContent">
      <Profile v-if="this.user !== undefined" :user="this.user"></Profile>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  head(): object {
    return {
      title: this.titlePage as String,
    };
  },
  async asyncData({ params, app, error }) {
    const username: string = params.username;
    const user: any = await app.$axios.get(`/api/user/userInfo?username=${username}`)
    .then((res: any) => res.data)
    .catch(() => undefined);

    if (user === undefined)
      return error({ statusCode: 404 });
    return { username, user };
  },
  computed: {
    titlePage(): string {
      const _this: any = this;
      let title: string = "Profile Page";

      if (_this.user) {
        if (_this.$store.state.user.userId == _this.user.userId) {
          title = 'My profile page';
        } else {
          title = `${_this.user.username}'s Profile Page`;
        }
      }
      return (title);
    },
  },
});
</script>

<style scoped lang="scss" src="./_username.scss">
</style>

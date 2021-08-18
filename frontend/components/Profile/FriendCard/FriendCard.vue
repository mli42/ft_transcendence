<template>
  <div>
    <div v-if="$fetchState.pending == false" class="friendCard flexAlignRow">
      <div class="pp">
        <Avatar :user="user"></Avatar>
      </div>
      <NuxtLink :to="userProfile">
        <p>{{shortUsername}}</p>
      </NuxtLink>
    </div>
    <p v-else-if="$fetchState.error">Oh no, an error occured...</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FriendCard',
  data() {
    return {
      user: {} as any,
      userProfile: '' as string,
    };
  },
  async fetch() {
    this.user = await this.$axios
    .get(`/api/user/partialInfo?userId=${this.userId}`)
    .then((resp: any) => resp.data)
    .catch(() => console.log('Oh no'));

    this.userProfile = `/profile/${this.user.username}`;
  },
  computed: {
    shortUsername(): string {
      const max_length: number = 10;
      const username = this.user.username;

      if (username.length <= max_length)
        return username;
      return username.substr(0, max_length - 3) + "...";
    },
  },
  props: ['userId'],
});
</script>

<style scoped lang="scss" src="./FriendCard.scss">
</style>

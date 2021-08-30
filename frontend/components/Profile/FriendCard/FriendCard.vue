<template>
  <div>
    <div v-if="$fetchState.pending == false" class="friendCard flexAlignRow">
      <div class="pp">
        <Avatar :user="user"></Avatar>
      </div>
      <NuxtLink :to="userProfile">
        <p>{{shortUsername}}</p>
      </NuxtLink>
      <Iconify v-if="user.status == 'Playing'" title="Currently playing"
      iconName="ri:sword-line" class="playing"></Iconify>
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
    .catch(this.$mytoast.defaultCatch);

    this.userProfile = `/profile/${this.user.username}`;
  },
  computed: {
    shortUsername(): string {
      return (this.$user.shortName(this.user.username));
    },
  },
  props: ['userId'],
});
</script>

<style scoped lang="scss" src="./FriendCard.scss">
</style>

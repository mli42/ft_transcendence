<template>
  <div>
    <div v-if="$fetchState.pending == false && shortUsername" class="friendCard flexAlignRow">
      <div class="pp" @click="sendEventChat">
        <Avatar :user="user"></Avatar>
      </div>
      <NuxtLink :to="userProfile">
        <p>{{shortUsername}}</p>
      </NuxtLink>
      <NuxtLink v-if="isPlaying" :to="gameURL">
        <Iconify title="Currently playing"
        iconName="ri:sword-line" class="playing"></Iconify>
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
    .catch(this.$mytoast.defaultCatch);

    this.userProfile = `/profile/${this.user.username}`;
  },
  computed: {
    shortUsername(): string {
      return (this.$user.shortName(this.user.username));
    },
    playingUsers(): any {
      return this.$store.state.playingUsers;
    },
    isPlaying(): boolean {
      const keys: any = Object.keys(this.playingUsers);
      return keys.includes(this.userId);
    },
    gameURL(): string {
      if (this.isPlaying == false)
        return '';
      return `/game/${this.playingUsers[this.userId]}`;
    },
  },
  methods: {
    sendEventChat(): void{
      if (this.page == 'chat')
        this.$nuxt.$emit('my-chat-event', this.user);
    },
  },
  props: ['userId', 'page'],
});
</script>

<style scoped lang="scss" src="./FriendCard.scss">
</style>

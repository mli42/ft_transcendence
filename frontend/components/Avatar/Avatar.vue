<template>
  <div class="avatarContainer">
    <img :src="avatarURL" :title="imgTitle"
    style="width: 100%; height: 100%; border-radius: 50%;"
    :alt="`${user.username}'s profile picture`" />
    <div v-if="showStatus" :title="title"
    :class="statusClass" :style="statusStyle"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Avatar',
  data() {
    return {
      defaultAvatarName: 'deluxe_pong_default_picture.png' as string,
    };
  },
  computed: {
    hasAvatar(): boolean {
      return (this.user?.profile_picture);
    },
    avatarURL(): string {
      return `${this.$user.avatarBaseURL}/${this.user?.profile_picture || this.defaultAvatarName}`;
    },
    imgTitle(): string {
      return (this.hasAvatar) ? "User's Avatar" : 'Deleted User';
    },
    title(): string {
      return (this.isConnected) ? 'is Online' : 'is Offline';
    },
    statusClass(): Object {
      return {
        status: true,
        profileAvatar: this.isBig,
        smallAvatar: !this.isBig,
      };
    },
    statusStyle(): Object {
      return {
        background: (this.isConnected ? 'green' : 'grey'),
      };
    },
    isConnected(): boolean {
      return (this.$store.state.connectedUsers.includes(this.user.userId));
    },
  },
  props: {
    user: {
      type: [Object, String],
      required: true,
    },
    showStatus: {
      type: Boolean,
      required: false,
      default: true,
    },
    isBig: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
});
</script>

<style scoped lang="scss" src="./Avatar.scss">
</style>

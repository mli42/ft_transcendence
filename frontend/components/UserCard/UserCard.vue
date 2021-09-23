<template>
  <div :class="{ bgDarkBlue : channel.channelId === currentChannel.channelId }" @click="joinChannel(index)">
    <div class="pp flexHVcenter" v-if="channel.directMessage">
      <Avatar :user="whoIsIt()" ></Avatar>
    </div>
    <img v-else class="pp" src="~/assets/img/chatbubble.svg">
      <p v-if="channel.directMessage"> {{ whoIsIt().username }}</p>
      <p v-else>{{ channel.channelName }}</p>
      <img v-if="!channel.publicChannel && !channel.directMessage" class="lock" src="~/assets/img/padlock.svg">
    <img  v-if="channel.channelId === currentChannel.channelId && !channel.publicChannel" class="cross" src="~/assets/img/red_cross.svg" @click.stop="leaveChannel(channel, currentUser)">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { User } from '~/types/chatTypes';

export default Vue.extend({
  name: 'userCard',
  layout: 'default',
  data(): any {
    return {
        // selected: false as boolean,
    }
  },
  methods: {
    whoIsIt(): User{
      let find: User|any = this.channel.users.find((el: User) => el.userId != this.currentUser.userId)
      if (find)
        return find;
      else
        return this.currentUser;
    },
  },
  computed: {
    checkselected(): void{
      if (this.channel.channelId === this.currentChannel.channelId)
        this.selected = true;
      else
        this.selected = false;
    }
  },
  props: ['channel', 'joinChannel', 'index', 'currentChannel', 'currentUser', 'leaveChannel'],
});
</script>

<style scoped lang="scss" src="./UserCard.scss">
</style>

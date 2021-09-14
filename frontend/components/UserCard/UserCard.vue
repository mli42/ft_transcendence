<template>
  <div :class="{ red : channel.channelName === channelName }" @click="joinChannel(index)">
    <img v-if="!channel.directMessage" src="~/assets/img/chatbubble.svg">
    <Avatar v-if="channel.directMessage" :user="whoIsIt()" ></Avatar>
    <p>{{ channel.channelName }}</p>
    <img v-if="!channel.publicChannel" class="lock" src="~/assets/img/padlock.svg">
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
      let find: User = this.channel.users.find((el: User) => el.userId != this.currentUser.userId)
      return find
    },
  },
  computed: {
    checkselected(): void{
      if (this.channel.channelName === this.channelName)
        this.selected = true;
      else
        this.selected = false;
    }
  },
  props: ['channel', 'joinChannel', 'index', 'channelName', 'currentUser'],
});
</script>

<style scoped lang="scss" src="./UserCard.scss">
</style>

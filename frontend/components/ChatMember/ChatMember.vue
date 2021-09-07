<template>
  <div class="friendContainer" @click.prevent="getModStatus">
    <p>Members</p> <hr />
    <div class="friendList">
      <div v-for="(user, index) in users" :key="index">
        <ProfileFriendCard :userId="user.userId" page="chat" ></ProfileFriendCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {UserStatus, User, Message, Channel} from '~/types/chatTypes';

export default Vue.extend({
  name: 'FriendList',
  data(){
    return {
      users: [] as User[],
    }
  },
  props: ['channelUsers', 'public', 'getModStatus'],
  async fetch() {
    this.users = await this.$axios
    .get(`/api/admin/allUsers`)
    .then((response: any): User[] =>{
      if (this.public === true)
        return response.data;
      else
        return this.channelUsers;
    })
    .catch((error: any): User[] =>{
      return [];
    });
  },
  watch: {
    channelUsers(): void{
      this.users = [];
      this.$nuxt.refresh();
    },
  }
});
</script>

<style scoped lang="scss" src="./ChatMember.scss">

</style>
<template>
  <div class="friendContainer">
    <p>Friends</p> <hr />
    <p class="NoFriend" v-if="user.friends.length == 0">
      Search some profiles to add new friends!
    </p>
    <div v-else class="friendList">
      <div v-for="(userId, index) in user.friends" :key="index">
        <ProfileFriendCard :userId="userId"></ProfileFriendCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FriendList',
  props: ['user'],
});
</script>

<style scoped lang="scss" src="../Profile.scss">
</style>

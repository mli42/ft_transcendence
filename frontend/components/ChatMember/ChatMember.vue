<template>
  <div class="friendContainer">
    <p>Friends</p> <hr />
    <div class="friendList">
      <div v-for="(user, index) in channelUsers" :key="index">
        <ProfileFriendCard :userId="user.userId"></ProfileFriendCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FriendList',
  props: ['channelUsers'],
});
</script>

<style scoped lang="scss" src="../Profile/Profile.scss">

</style>
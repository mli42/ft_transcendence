<template>
  <div class="MemberContainer">
    <p>Friends</p> <hr />
    <div class="MemberList">
      <div v-for="(member, index) in members" :key="index">
        <ProfileFriendCard :userId="userId"></ProfileFriendCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FriendList',
  props: ['members'],
});
</script>

<style scoped lang="scss" src="./ChatMember.scss">

</style>
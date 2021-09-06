<template>
  <overflowContainer width="256px" heightMax="384px" label="Friends">
    <p class="NoFriend" v-if="user.friends.length == 0">
      Search some profiles to add new friends!
    </p>
    <div v-else style="width: 100%;">
      <ProfileFriendCard v-for="(userId, index) in user.friends" :key="index"
      :userId="userId"></ProfileFriendCard>
    </div>
  </overflowContainer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FriendList',
  props: ['user'],
});
</script>

<style scoped lang="scss">
p.NoFriend {
  width: 200px;
  font-size: 18px !important;
  line-height: 18px !important;
  text-align: center;
  margin-bottom: 16px;
}
</style>

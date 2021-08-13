<template>
  <div class="searchUserCard flexAlignRow">

    <NuxtLink :to="userProfile" class="pp flexHVcenter">
      <img src="" :alt="`${user.username}'s profile picture`">
    </NuxtLink>

    <div class="mainInfos flexAlignCol">
      <NuxtLink :to="userProfile">
        <p class="username">{{user.username}}</p>
      </NuxtLink>
      <p class="elo">elo: {{user.elo}}</p>
    </div>

    <div class="bulletStats flexAlignRow">
      <div class="bulletContainer"> <div class="bullet win"></div> <p>{{user.game_won}} wins</p> </div>
      <div class="bulletContainer"> <div class="bullet lose"></div> <p>{{user.lost_game}} losses</p> </div>
      <div class="bulletContainer"> <div class="bullet ratio"></div> <p>{{ratio}} ratio</p> </div>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'searchCard',
  data() {
    return {
      ratio: (this.user.ratio == -1 ? 'N/A' : this.user.ratio) as any,
      userProfile: `/profile/${this.user.username}` as string,
    };
  },
  props: ['user'],
});
</script>

<style scoped lang="scss" src="./searchCard.scss">
</style>

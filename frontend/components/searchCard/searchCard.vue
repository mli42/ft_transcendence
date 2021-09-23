<template>
  <div class="searchUserCard flexAlignRow">

    <NuxtLink :to="userProfile" class="pp flexHVcenter">
      <Avatar :user="user"></Avatar>
    </NuxtLink>

    <div class="mainInfos flexAlignCol">
      <NuxtLink :to="userProfile">
        <p class="username">{{shortUsername}}</p>
      </NuxtLink>
      <div class="flexAlignRow">
        <p class="elo">elo: {{user.elo}}</p>
        <Iconify v-if="user.status == 'Playing'" title="Currently playing"
        iconName="ri:sword-line" class="playing"></Iconify>
      </div>
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
  computed: {
    shortUsername(): string {
      return (this.$user.shortName(this.user.username, 12));
    },
    ratio(): string {
      return (this.user.ratio == -1 ? 'N/A' : `${this.user.ratio}%`);
    },
    userProfile(): string {
      return `/profile/${this.user.username}`;
    },
  },
  props: ['user'],
});
</script>

<style scoped lang="scss" src="./searchCard.scss">
</style>

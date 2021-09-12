<template>
  <div id="HomePage" class="flexAlignCol">
    <div class="homeTop flexAlignRow">
      <img src="~/assets/img/logo500.png" alt="Deluxe Pong Logo" class="cantSelect">
      <hr class="topHR" />
      <div class="topContent">
        <h1>Your Home</h1>
        <div id="homeButtons" class="flexAlignRow">
          <HomeButton linkTo="/game" text="Play Pong" iconName="ion:tennisball-outline"></HomeButton>
          <HomeButton linkTo="/chat" text="Chat" iconName="carbon-send-alt"></HomeButton>
          <HomeButton linkTo="/search" text="Search" iconName="ant-design:search-outlined"></HomeButton>
        </div>
      </div>
    </div>

    <div class="homeBot flexAlignRow">
      <div class="homeLeft">
        <ProfileFriendList :user="user"></ProfileFriendList>
      </div>

      <hr class="topHR" style="visibility: hidden;" />

      <!-- Current Games -->
      <overflowContainer width="726px" heightMax="358px" label="Current games">
        <gameCardSpectate v-for="(gameId, index) in currentGames" :key="index"
        :gameId="gameId" />
        <p v-if="currentGames.length == 0">No game at the moment...</p>
      </overflowContainer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'root-index',
  head(): object {
    return {
      title: "Home Page" as String,
    };
  },
  data() {
    return {
      currentGames: [] as any,
    };
  },
  async fetch() {
    await this.$axios.get('/api/game/playingGames')
    .then((res: any) => { this.currentGames = res.data; })
    .catch(this.$mytoast.defaultCatch);
  },
  computed: {
    user(): any {
      return this.$store.state.user;
    },
  },
});
</script>

<style scoped lang="scss" src="./index.scss">
</style>

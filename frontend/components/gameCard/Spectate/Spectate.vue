<template>
  <div class="gameSpectateMain flexAlignRow" v-if="$fetchState.pending == false">
    <!-- Players -->
    <div class="players flexAlignRow">

      <!-- Creator Infos -->
      <div class="flexAlignRow">
        <NuxtLink :to="`/profile/${creaUser.username}`" class="avatar"> <Avatar :user="creaUser" :showStatus=false></Avatar> </NuxtLink>
        <div class="usertxt flexHVcenter flexAlignCol">
          <p>{{creaUser.username}}</p>
          <p>elo</p>
        </div>
      </div>

      <Iconify iconName="ri:sword-line" class="battleIcon"></Iconify>

      <!-- Opponent Infos -->
      <div class="flexAlignRow">
        <div class="usertxt flexHVcenter flexAlignCol">
          <p>{{oppoUser.username}}</p>
          <p>elo</p>
        </div>
        <NuxtLink :to="`/profile/${oppoUser.username}`" class="avatar"> <Avatar :user="oppoUser" :showStatus=false></Avatar> </NuxtLink>
      </div>
    </div>

    <!-- Timer -->
    <div class="timer">
      <p>Timer</p>
    </div>

    <!-- Spectate Button -->
    <v-btn rounded :to="`/game/${this.gameId}`">
      Spectate
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { gameInfos, } from '~/types/game.ts';
import { partialInfos, } from '~/types/user.ts';

export default Vue.extend({
  name: 'Spectate',
  data() {
    return {
      gameInfos: new gameInfos() as gameInfos,
      creaUser: new partialInfos() as partialInfos,
      oppoUser: new partialInfos() as partialInfos,
    };
  },
  async fetch() {
    // Fetch game infos
    await this.$axios.get(`/api/game/playingGames/${this.gameId}`)
    .then((res: any) => { this.gameInfos = res.data })
    .catch(this.$mytoast.defaultCatch);

    // Fetch creator infos
    if (this.gameInfos.creatorId) {
      this.$axios.get(`/api/user/partialInfo?userId=${this.gameInfos.creatorId}`)
      .then((res: any) => { this.creaUser = res.data })
      .catch(this.$mytoast.defaultCatch);
    }

    // Fetch opponent infos
    if (this.gameInfos.opponentId) {
      this.$axios.get(`/api/user/partialInfo?userId=${this.gameInfos.opponentId}`)
      .then((res: any) => { this.oppoUser = res.data })
      .catch(this.$mytoast.defaultCatch);
    }
  },
  props: ['gameId'],
});
</script>

<style scoped lang="scss" src="./Spectate.scss">
</style>

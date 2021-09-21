<template>
  <div class="gameSpectateMain flexAlignRow" v-if="$fetchState.pending == false">
    <!-- Players -->
    <div class="players flexAlignRow">

      <!-- Creator Infos -->
      <div class="flexAlignRow">
        <NuxtLink :to="`/profile/${creaUser.username}`" class="avatar"> <Avatar :user="creaUser" :showStatus=false></Avatar> </NuxtLink>
        <div class="userTxt flexHVcenter flexAlignCol">
          <p>{{creaUser.username}}</p>
          <p>{{creaUser.elo}} elo</p>
        </div>
      </div>

      <p class="flexHVcenter">{{gameInfos.score[0]}}</p>
      <Iconify iconName="ri:sword-line" class="battleIcon"></Iconify>
      <p class="flexHVcenter">{{gameInfos.score[1]}}</p>

      <!-- Opponent Infos -->
      <div class="flexAlignRow">
      <div class="userTxt flexHVcenter flexAlignCol">
          <p>{{oppoUser.username}}</p>
          <p>{{oppoUser.elo}} elo</p>
        </div>
        <NuxtLink :to="`/profile/${oppoUser.username}`" class="avatar"> <Avatar :user="oppoUser" :showStatus=false></Avatar> </NuxtLink>
      </div>
    </div>

    <!-- Timer -->
    <div class="timer flexAlignRow">
      <p>{{this.since}}</p>
      <Iconify iconName="jam:chronometer" />
    </div>

    <!-- Spectate Button -->
    <v-btn rounded :to="`/game/${this.gameId}`">
      Spectate
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { gameInfos, } from '~/types/game';
import { partialInfos, } from '~/types/user';

export default Vue.extend({
  name: 'Spectate',
  data() {
    return {
      gameInfos: new gameInfos() as gameInfos,
      creaUser: new partialInfos() as partialInfos,
      oppoUser: new partialInfos() as partialInfos,
      dateInteval: 0 as any, // setInterval return
      since: '' as string,
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

    // Update timer
    const nowDate: any = new Date();
    const beginDate: any = new Date(this.gameInfos.startDate);
    let deltaDate: Date = new Date(nowDate - beginDate);
    deltaDate.setHours(deltaDate.getHours() - 1);

    this.updateSince(deltaDate);
    this.dateInteval = setInterval(() => {
      deltaDate.setSeconds(deltaDate.getSeconds() + 1);
      this.updateSince(deltaDate);
    }, 1000);
  },
  destroyed() {
    clearInterval(this.dateInteval);
  },
  methods: {
    updateSince(date: Date): void {
      const hrs: string = `${date.getHours()}`.padStart(2, '0');
      const min: string = `${date.getMinutes()}`.padStart(2, '0');
      const sec: string = `${date.getSeconds()}`.padStart(2, '0');
      this.since = (hrs !== '00') ? `${hrs}:` : '';
      this.since += `${min}:${sec}`;
    },
  },
  props: ['gameId'],
});
</script>

<style scoped lang="scss" src="./Spectate.scss">
</style>

<template>
  <div class="gameSpectateMain flexAlignRow" :class="borderColor" v-if="$fetchState.pending == false">
    <!-- Players -->
    <div class="players flexAlignRow">

      <!-- PlayerOne Infos -->
      <div class="flexAlignRow">
        <NuxtLink :to="`/profile/${playerOne.username}`" class="avatar"> <Avatar :user="playerOne" :showStatus=false></Avatar> </NuxtLink>
        <div class="userTxt flexHVcenter flexAlignCol">
          <template v-if="playerOne.length != 0">
            <p>{{playerOne.username}}</p>
            <p>{{playerOne.elo}} elo</p>
          </template>
          <p v-else>Deleted user</p>
        </div>
      </div>

      <p class="flexHVcenter">{{game.score[0]}}</p>
      <Iconify iconName="ri:sword-line" class="battleIcon"></Iconify>
      <p class="flexHVcenter">{{game.score[1]}}</p>

      <!-- PlayerTwo Infos -->
      <div class="flexAlignRow">
        <div class="userTxt flexHVcenter flexAlignCol">
          <template v-if="playerTwo.length != 0">
            <p>{{playerTwo.username}}</p>
            <p>{{playerTwo.elo}} elo</p>
          </template>
          <p v-else>Deleted user</p>
        </div>
        <NuxtLink :to="`/profile/${playerTwo.username}`" class="avatar"> <Avatar :user="playerTwo" :showStatus=false></Avatar> </NuxtLink>
      </div>
    </div>

    <!-- Timer -->
    <div class="timer flexAlignCol">
      <div class="flexAlignRow" title="Game Duration">
        <p>{{durationStr}}</p>
        <Iconify iconName="jam:chronometer" />
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'History',
  data() {
    return {
      playerOne: {} as any,
      playerTwo: {} as any,
      playerWin: {} as any,
      playerLose: {} as any,
    };
  },
  async fetch() {
    // Fetch playerOne
    await this.$axios.get(`/api/user/partialInfo?userId=${this.game.playerOne}`)
    .then((res: any) => { this.playerOne = res.data })
    .catch(this.$mytoast.defaultCatch);

    // Fetch playerTwo
    await this.$axios.get(`/api/user/partialInfo?userId=${this.game.playerTwo}`)
    .then((res: any) => { this.playerTwo = res.data })
    .catch(this.$mytoast.defaultCatch);

    // Assign PlayerWin/PlayerLose
    if (this.game.playerWin === this.game.playerOne) {
      this.playerWin = this.playerOne;
      this.playerLose = this.playerTwo;
    } else {
      this.playerWin = this.playerTwo;
      this.playerLose = this.playerOne;
    }
  },
  computed: {
    borderColor(): any {
      const won: boolean = (this.user.userId === this.game.playerWin);
      return {
        winningGame: won,
        losingGame: !won,
      };
    },
    durationStr(): string {
      const timeToConvert: number = this.game.gameDuration;
      const minutes: string = `${Math.floor(timeToConvert / 60000)}`.padStart(2, '0');
      const seconds: string = ((timeToConvert % 60000) / 1000).toFixed(0).padStart(2, '0');
      return `${minutes}:${seconds}`;
    },
  },
  props: ['game', 'user'],
});
</script>

<style scoped lang="scss" src="./History.scss">
</style>

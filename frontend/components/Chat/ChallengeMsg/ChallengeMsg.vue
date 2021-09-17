<template>
  <div class="flexHVcenter flexAlignCol ChallengeMsgMain">
    <p>{{OneUsername}} VS {{TwoUsername}}</p>
    <v-btn small nuxt :href="gameURL" :disabled="!isConcerned" >Accept Challenge</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ChallengeMsg',
  data() {
    return {
      OneUsername: '' as string,
      OneUserId: '' as string,
      TwoUsername: '' as string,
      TwoUserId: '' as string,
      gameURL: '' as string,
      isConcerned: false as boolean,
      mySelf: this.$store.state.user as any,
    };
  },
  fetch() {
    // `${OneUsername} ${OneUserId} ${TwoUsername} ${TwoUserId} ${gameURL}`;
    let reg: RegExp = /(\w+) (.+) (\w+) (.+) (.+)/g;
    let regParse: any = reg.exec(this.content);

    if (regParse === undefined)
      return ;
    [, this.OneUsername, this.OneUserId,
    this.TwoUsername, this.TwoUserId, this.gameURL] = regParse;
    this.isConcerned = (this.mySelf.userId == this.OneUserId || this.mySelf.userId == this.TwoUserId);
  },
  props: ['content'],
});
</script>

<style scoped lang="scss" src="./ChallengeMsg.scss">
</style>

<template>
  <div id="profileMain">
    <div id="profileLeft">
      <!-- Left side content (pp, buttons, friend list) -->
      <div class="pp">
        <Avatar :isBig=true :user="user"></Avatar>
      </div>

      <div v-if="!isMyself" class="modBtnContainer flexAlignRow">
        <ProfileModBtn class="modAddFriend" @toggled="modFriend" :icon="modFriendIcon"></ProfileModBtn>
        <ProfileModBtn v-if="myself.isAdmin" class="modBan" @toggled="modBan" :title="banTitle" icon="jam:hammer"></ProfileModBtn>
        <ProfileModBtn v-if="myself.isAdmin" class="modPromote" @toggled="modPromote" :title="adminTitle" icon="bx:bx-key"></ProfileModBtn>
      </div>

      <ProfileFriendList :user="user"></ProfileFriendList>
    </div>

    <div>
      <p class="bigUsername">{{user.username}}</p>

      <div class="primaryContent primaryContentUp flexAlignRow">
        <div class="flexHVcenter flexAlignRow">
          <Iconify iconName="ant-design:trophy-outlined"
          class="BigIcon" ></Iconify>
          <p>{{user.elo}} elo</p>
        </div>
        <div class="flexHVcenter flexAlignRow" title="SignUp Date">
          <Iconify iconName="ant-design:clock-circle-outlined"
          class="BigIcon" ></Iconify>
          <p>{{user.sign_up_date}}</p>
        </div>
      </div>

      <div class="primaryContent primaryContentUp flexAlignRow">
        <div> <div class="bullet win"></div> <p>{{user.game_won}} wins</p> </div>
        <div> <div class="bullet lose"></div> <p>{{user.lost_game}} losses</p> </div>
        <div> <div class="bullet ratio"></div> <p>{{ratio}} ratio</p> </div>
      </div>
      <!-- Game History -->
      <overflowContainer width="664px" heightMin="60px" heightMax="360px"
      label="Game History" style="margin: 32px">
        <p v-if="gameHistory.length == 0">No game at the moment...</p>
        <gameCardHistory v-for="(game, index) in gameHistory"
        :key="index" :game="game" :user="user" />
      </overflowContainer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Profile',
  data() {
    return {
      gameHistory: [] as any,
    };
  },
  fetch() {
    this.$axios.get(`/api/user/gameHistory/${this.user.userId}`)
    .then((res: any) => { this.gameHistory = res.data.reverse(); })
    .catch(this.$mytoast.defaultCatch);
  },
  methods: {
    modFriend(): void {
      let url: string;
      let method: any;
      let toastMsg: string;
      let commitStoreFriend: string;
      const handleThen: any = () => {
        this.$store.commit(commitStoreFriend, this.user.userId);
        this.$mytoast.succ(toastMsg);
      };
      const data: any = { userId: this.user.userId };

      if (!this.isMyFriend) {
        url = '/api/user/addFriend';
        method = 'patch';
        toastMsg = 'Yeah you have a new friend!';
        commitStoreFriend = 'addFriend';
      }
      else {
        url = '/api/user/deleteFriend';
        method = 'delete';
        toastMsg = `User un-friended &#x1F389 Bye bye`;
        commitStoreFriend = 'delFriend';
      }
      this.$axios.request({url, data, method})
      .then(handleThen)
      .catch(this.$mytoast.defaultCatch);
    },
    modBan(): void {
      this.$axios.patch(`/api/user/updateIsBan?userId=${this.user.userId}`, {
        toggle: !this.user.isBan,
      })
      .then(() => {
        this.user.isBan = !this.user.isBan;
        const status: string = this.user.isBan ? 'banned' : 'un-banned';
        this.$mytoast.succ(`User ${this.user.username} ${status}`);
      })
      .catch(this.$mytoast.defaultCatch);
    },
    modPromote(): void {
      this.$axios.patch(`/api/user/updateIsAdmin?userId=${this.user.userId}`, {
        toggle: !this.user.isAdmin,
      })
      .then(() => {
        this.user.isAdmin = !this.user.isAdmin;
        const status: string = this.user.isAdmin ? 'promoted' : 'downgraded';
        this.$mytoast.succ(`User ${this.user.username} ${status}`);
      })
      .catch(this.$mytoast.defaultCatch);
    },
  },
  computed: {
    myself(): any {
      return this.$store.state.user;
    },
    isMyself(): boolean {
      return (this.user.userId == this.$store.state.user.userId);
    },
    isMyFriend(): boolean {
      return this.$store.state.user.friends.includes(this.user.userId);
    },
    modFriendIcon(): string {
      return (!this.isMyFriend) ? 'bx:bx-user-plus' : 'bx:bx-user-minus';
    },
    ratio(): string {
      return (this.user.ratio == -1) ? 'N/A' : `${this.user.ratio}%`;
    },
    banTitle(): string {
      return this.user.isBan ? 'Un-ban user' : 'Ostracize user';
    },
    adminTitle(): string {
      return this.user.isAdmin ? 'Downgrade user' : 'Promote user as admin';
    },
  },
  props: ['user'],
});
</script>

<style scoped lang="scss" src="./Profile.scss">
</style>

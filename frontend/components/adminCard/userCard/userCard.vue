<template>
  <div class="adminCardMain flexAlignRow">
    <div class="flexAlignRow flexHVcenter">
      <div class="pp">
        <Avatar :user="user"></Avatar>
      </div>
      <NuxtLink :to="userProfile">
        <p class="username">{{shortUsername}}</p>
      </NuxtLink>
    </div>
    <div class="modButtons flexAlignRow">
      <v-btn :class=[banBtnClass] @click="emitBanState" >{{banStateStr}}</v-btn>
      <v-btn :class=[adminStateBtnClass] @click="emitAdminState">{{adminStateStr}}</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'userCard',
  data() {
    return {
    };
  },
  methods: {
    emitBanState(): void {
      this.$emit('toggleBanUser');
    },
    emitAdminState(): void {
      this.$emit('toggleAdminState');
    },
  },
  computed: {
    userProfile(): string {
      return `/profile/${this.user.username}`;
    },
    shortUsername(): string {
      return (this.$user.shortName(this.user.username, 15));
    },
    banStateStr(): string {
      return !this.user.isBan ? 'Ban' : 'Unban';
    },
    banBtnClass(): object {
      return {
        modBtn: true,
        modBanStateBtn: true,
        redBg: !this.user.isBan,
        greenBg: this.user.isBan,
      };
    },
    adminStateStr(): string {
      return !this.user.isAdmin ? 'Promote' : 'Downgrade';
    },
    adminStateBtnClass(): object {
      return {
        modBtn: true,
        modAdminStateBtn: true,
        redBg: this.user.isAdmin,
        greenBg: !this.user.isAdmin,
      };
    },
  },
  props: ['user'],
});
</script>

<style scoped lang="scss" src="./userCard.scss">
</style>

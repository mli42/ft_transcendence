<template>
  <div id="banner" class="cantSelect">
    <nav>
      <div class="align-content">
        <!-- Buttons Home/Play/Chat/Search -->
        <div class="homebtn"><NavBarHomeBtn></NavBarHomeBtn></div>
        <NavBarRoundBtn route="/game" icone="ion:tennisball-outline"></NavBarRoundBtn>
        <NavBarRoundBtn route="/chat" icone="carbon-send-alt"></NavBarRoundBtn>
        <NavBarRoundBtn route="/search" icone="ant-design:search-outlined"></NavBarRoundBtn>
        <NavBarRoundBtn route="/rules" icone="bi:question-diamond"></NavBarRoundBtn>
      </div>
      <div class="align-content">
        <!-- Buttons Profile/Settings/Quit -->
        <NavBarProfileBtn :route="profileRoute"></NavBarProfileBtn>
        <NavBarRoundBtn route="/admin" icone="icon-park-outline:people-safe" v-if="isAdmin" ></NavBarRoundBtn>
        <NavBarRoundBtn route="/settings" icone="ci:settings"></NavBarRoundBtn>
        <NavBarLogoutBtn icone="lucide:log-out" :logOut="this.$user.logout"></NavBarLogoutBtn>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NavBar',
  computed: {
    profileRoute(): string {
      return `/profile/${this.$store.state.user.username}`;
    },
    isAdmin(): boolean {
      return this.$store.state.user.isAdmin;
    },
  },
});
</script>

<style scoped lang="scss" src="./NavBar.scss">
</style>

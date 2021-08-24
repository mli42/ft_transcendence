<template>
  <div id="banner">
    <nav>
      <div class="align-content">
        <!-- Buttons Home/Play/Chat/Search -->
        <div class="homebtn"><NavBarHomeBtn></NavBarHomeBtn></div>
        <NavBarRoundBtn route="/pre-game" icone="ion:tennisball-outline"></NavBarRoundBtn>
        <NavBarRoundBtn route="/chat" icone="carbon-send-alt"></NavBarRoundBtn>
        <NavBarRoundBtn route="/search" icone="ant-design:search-outlined"></NavBarRoundBtn>
      </div>
      <div class="align-content">
        <!-- Buttons Profile/Settings/Quit -->
        <NavBarProfileBtn :route="profileRoute"></NavBarProfileBtn>
        <NavBarRoundBtn route="/settings" icone="ci:settings"></NavBarRoundBtn>
        <NavBarLogoutBtn icone="lucide:log-out" :logOut="logOut"></NavBarLogoutBtn>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NavBar',
  data() {
    return {
    };
  },
  computed: {
    profileRoute(): string {
      return `/profile/${this.$store.state.user.username}`;
    },
  },
  methods: {
    logOut(): void{
      this.$axios
      .delete('/api/user/logout')
      .then((response: any): void => {
        this.$router.push('/login')
        this.$mytoast.info('Logged out');
      })
      .catch((error: any): void => {
        console.log("LOGOUT FAILURE");
      });
    }
  },
});
</script>

<style scoped lang="scss" src="./NavBar.scss">
</style>

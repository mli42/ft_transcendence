<template>
  <div id="banner">
    <nav>
      <div class="align-content">
        <!-- Buttons Home/Play/Chat/Search -->
        <div class="homebtn"><NavBarHomeBtn></NavBarHomeBtn></div>
        <NavBarRoundBtn route="/play" icone="ion:tennisball-outline"></NavBarRoundBtn>
        <NavBarRoundBtn route="/chat" icone="carbon-send-alt"></NavBarRoundBtn>
        <NavBarRoundBtn route="/search" icone="ant-design:search-outlined"></NavBarRoundBtn>
      </div>
      <div class="align-content">
        <!-- Buttons Profile/Settings/Quit -->
        <NavBarRoundBtn :route="profileRoute" icone="icon-park-outline:people-safe"></NavBarRoundBtn>
        <NavBarRoundBtn route="/settings" icone="ci:settings"></NavBarRoundBtn>
        <NavBarRoundBtn route="/login" icone="lucide:log-out"></NavBarRoundBtn>
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
      profileRoute: `/profile/${this.$store.state.auth.user.username}` as string,
    };
  },
  methods: {
  },
});
</script>

<style scoped lang="scss" src="./NavBar.scss">
</style>

<template>
  <div>
    <p>You will be redirected to a game creation</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "indexGamePage" as string,
  mounted() {
    window.$nuxt.$router.push("/pre-game/"); // Redirect client
  },
});
</script>

<style scoped lang="scss">

</style>

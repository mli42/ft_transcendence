<template>
  <div class="wrapperCanvas">
    <div class="gameCanvas">
      <p>{{ gameId }}</p>
      <div>{{ game }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  Game,
} from "./dataStructures";

export default Vue.extend({
  name: "gameCanvas" as string,
  props: {
    gameId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      game: new Game(),
    }
  },
},
);
</script>

<style scoped lang="scss" src="./gameCanvas.scss">

</style>

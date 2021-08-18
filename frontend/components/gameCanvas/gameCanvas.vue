<template>
  <div class="wrapperCanvas">
    <div class="gameCanvas">
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
  data() {
    return {
      game: new Game(),
      id: this.$route.path.match("[^/]+$"), // Get the id of the path
    }
  },
  mounted() {
    console.log("id = " + this.id);
  },
},
);
</script>

<style scoped lang="scss" src="./gameCanvas.scss">

</style>

<template>
  <div data-app>
    <v-btn v-on:click="isGameDisplayedNeg">SHOW/HIDE THE GAME</v-btn>
    <br>
    <div id="gameInfo">
      <h1>[DEV] Game data log :</h1>
      <p>gameId = {{ this.game.id }}</p>
      <p>ball = {{ this.game.ball }}</p>
      <p>state = {{ this.game.state }}</p>
      <p>score = {{ this.game.score }}</p>
      <p>players = {{ playersList }}</p>
      <p>mapName = {{ this.game.mapName }}</p>
      <p>enabledPowerUps = {{ this.game.enabledPowerUps }}</p>
    </div>
    <hr>
    <div id="gameSettings">
      <h1>User settings</h1>
      <label for="mapSelect">Choose a map</label>
      <v-select
        id="mapSelect"
        v-model="game.mapName"
        item-value="text"
        :items="mapNames"
        filled
      ></v-select>
      <label>Choose your color: </label>
      <br>

      <button class="dot playerRed" @click="changePlayerColor('Red')"></button>
      <button class="dot playerGreen" @click="changePlayerColor('Green')"></button>
      <button class="dot playerBlue" @click="changePlayerColor('Blue')"></button>
      <button class="dot playerYellow" @click="changePlayerColor('Yellow')"></button>
      <button class="dot playerPurple" @click="changePlayerColor('Purple')"></button>
      <button class="dot playerPink" @click="changePlayerColor('Pink')"></button>
      <span class="playerBar" v-bind:class="playerColorClass"></span>
      <br>
      <v-combobox
        multiple
        outlined
        small-chips
        label="Choose power-ups you want to enable"
        v-model="game.enabledPowerUps"
        hint="⚠ You can't edit this list"
        :items="powList"
        id="powCombo"
      ></v-combobox>
    </div>
    <div v-show="isGameDisplayed" id="gameCanvas">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Game, Player } from "./dataStructures";
import lookup from "socket.io-client";
import { use } from "vue/types/umd";
import { socket, socketInit } from "./socket"
import { sketch } from "./sketch";

export { SOCKET_URL };

const SOCKET_URL:string = "ws://localhost:3000/";
const playerPalette: Map<string, string> = new Map ([
  ["Red", "#FA163F"],
  ["Green", "#54E346"],
  ["Blue", "#3EDBF0"],
  ["Yellow", "#FFF338"],
  ["Purple", "#D62AD0"],
  ["Pink", "#FB7AFC"],
]);

export default Vue.extend({
  name: "gameCanvas" as string,
  data() {
    return {
      game: new Game(),
      isGameDisplayed: true as boolean,
      gameId: this.$route.path.match("[^/]+$")?.toString() as string, // Get the id of the path
      user: this.$store.state.user as any,
      mapNames: [
        {text: "earth"},
        {text: "abstract1"},
        {text: "abstract2"},
        {text: "abstract3"},
        {text: "tennis"},
        {text: "beach"},
      ],
      playerColor: playerPalette.get("Red"), // Default color
      playerColorClass: "playerRed",
      playersList: {} as Array<any>,
      powList: [
        "➕ ball size up", "➖ ball size down", "⚡ bar speed up", "↔️ lenght up", "🔥 FIRE !"
      ],
    }
  },
  async mounted() {
    // Connect to the websocket
    socketInit(SOCKET_URL, this.gameId, this);
    // Init the game object
    this.game.id = this.gameId;
    this.game.players.set(this.user.userId, new Player());
    this.game.players.get(this.user.userId)?.name = this.user.username;
    // Update data for dev log
    this.playersList = Array.from(this.game.players.values());
    // Start the sketch
    const { default: P5 } = await import('p5');
    const canvas = new P5(sketch, document.getElementById('gameCanvas') as HTMLElement);
  },
  methods: {
    isGameDisplayedNeg(): void {
      this.isGameDisplayed = !this.isGameDisplayed;
    },
    changePlayerColor(color: string): void {
      this.game.players.get(this.user.userId)?.color = playerPalette.get(color);
      this.playerColor = playerPalette.get(color);
      this.playerColorClass = "player" + color;
    },
  },
  watch: {
    "game.mapName": function (newName: string, oldName: string) {
      socket.emit("mapChanged", newName);
      this.game.mapName = newName;
    },
    "game.players": function (newPlayers: Map<string, Player>, oldPlayer: Map<string, Player>) {
      socket.emit("playerChanged", newPlayers.get(this.user.userId));
    },
    "game.enabledPowerUps": function (): void { // Powerup protector
      let index: number;
      for (let pow of this.game.enabledPowerUps) {
        index = this.powList.indexOf(pow);
        if (index == -1) {
          this.game.enabledPowerUps.splice(index, 1);
          console.log(pow);
        }
      }
    }
  }
},
);
</script>

<style scoped lang="scss" src="./gameCanvas.scss">

</style>

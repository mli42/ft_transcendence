<template>
  <div data-app>
  <v-app>
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
      <p>game type = {{ this.tabTypes[this.tabTypesIndex] }}</p>
    </div>
    <hr>
    <div id="gameSettings">
      <h1>User settings</h1>
      <!-- GAME TYPE SELECTION -->
      <div id="type">
        <v-card>
          <v-tabs
            class="typeSelection"
            center-active
            v-model="tabTypesIndex"
          >
            <v-tab @click="displayMatchmaking">Matchmaking</v-tab>
            <v-tab @click="displayPrivateGame">Private Game</v-tab>
          </v-tabs>
        </v-card>
      </div>
      <!-- COLOR SELECTION -->
      <div id="color" v-if="this.isColorDisplayed">
        <label>Choose your color: </label>
        <br>
        <button class="dot playerRed" @click="changePlayerColor('Red')"></button>
        <button class="dot playerGreen" @click="changePlayerColor('Green')"></button>
        <button class="dot playerBlue" @click="changePlayerColor('Blue')"></button>
        <button class="dot playerYellow" @click="changePlayerColor('Yellow')"></button>
        <button class="dot playerPurple" @click="changePlayerColor('Purple')"></button>
        <button class="dot playerPink" @click="changePlayerColor('Pink')"></button>
        <span class="playerBar" v-bind:class="playerColorClass"></span>
      </div>
      <br>
      <!-- POW SELECTION -->
      <div id="pow" v-if="this.isPowDisplayed">
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
      <!-- MAP SELECTION -->
      <div id="map" v-if="this.isMapsDisplayed">
        <label for="mapSelect">Choose a map</label>
        <v-select
          id="mapSelect"
          v-model="game.mapName"
          item-value="text"
          :items="mapNames"
          filled
        ></v-select>
      </div>
      <!-- LIST OF THE CURRENT PLAYERS IN THE GAME  -->
      <div id="playersList">
        <p>Players in the room</p>

        <v-chip
          label
          v-bind:color="getCreatorColor()"
        >
          <v-icon left>mdi-account-circle-outline</v-icon>
          Test1
        </v-chip>
        <v-chip
          label
          v-bind:color="getSecondPlayerColor()"
        >
          <v-icon left>mdi-account-circle-outline</v-icon>
          Test2
        </v-chip>
      </div>
      <!-- JOIN THE GAME BUTTON -->
      <div>
        <v-btn
          id="joinBtn"
          color="success"
          v-if="isJoinBtnDisplayed"
        >JOIN THE GAME</v-btn>
      </div>
    </div>
    <div v-show="isGameDisplayed" id="gameCanvas">
    </div>
  </v-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Game, Player, IplayerPalette} from "./dataStructures";
import lookup from "socket.io-client";
import { use } from "vue/types/umd";
import { socket, socketInit } from "./socket"
import { sketch } from "./sketch";

export { SOCKET_URL };

const SOCKET_URL:string = "ws://localhost:3000/";

let playerPalette: IplayerPalette = {} as IplayerPalette;
playerPalette["Red"] = "#FA163F";
playerPalette["Green"] = "#54E346";
playerPalette["Blue"] = "#3EDBF0";
playerPalette["Yellow"] = "#FFF338";
playerPalette["Purple"] = "#D62AD0";
playerPalette["Pink"] = "#FB7AFC";

export default Vue.extend({
  name: "gameCanvas" as string,
  data() {
    return {
      game: new Game(), // Must be assignated by the server data
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
      playerColorClass: "playerRed",
      playersList: {} as Array<any>,
      powList: [
        "➕ ball size up", "➖ ball size down", "⚡ bar speed up", "↔️ lenght up", "🔥 FIRE !"
      ],
      isPowDisplayed: false as boolean,
      isGameDisplayed: false as boolean,
      isMapsDisplayed: false as boolean,
      isColorDisplayed: true as boolean,
      isJoinBtnDisplayed: false as boolean,
      tabTypesIndex: 0 as number,
      tabTypes: ["matchmaking", "private"] as Array<string>,
    }
  },
  async mounted() {
    // Connect to the websocket & fetch remote game class
    socketInit(SOCKET_URL, this.gameId, this);
    // update ui accord to game fetched
    this.updateDisplayedElem();
    // Start the sketch
    const { default: P5 } = await import('p5');
    const canvas = new P5(sketch, document.getElementById('gameCanvas') as HTMLElement);
  },
  methods: {
    isGameDisplayedNeg(): void { // Negative the boolean to display the canvas
      this.isGameDisplayed = !this.isGameDisplayed;
    },
    changePlayerColor(color: string): void {
      let currPlayer: Player | undefined = this.game.players.get(this.user.userId);
      if (currPlayer) {
        currPlayer.color = playerPalette[color];             // Update in player class
        this.playerColorClass = "player" + color;   // Update UI feedback
        socket.emit("changePlayerColorTS", {             // Update remote version
          userId: this.user.userId as string,
          player: currPlayer as Player
        });
      } else {
        console.error("ERR : changePlayerColor : map.get undefined !");
      }
    },
    displayMatchmaking(): void {
      if (this.game.players.has(this.user.userId) === true) {
        this.isColorDisplayed = true;
      } else {
        this.isColorDisplayed = false;
      }
      this.isJoinBtnDisplayed = false;
      this.isPowDisplayed = false;
      this.isMapsDisplayed = false;
    },
    displayPrivateGame(): void {
      if (this.game.players.has(this.user.userId) === true) { // If the current client is a player
        this.isColorDisplayed = true;
        this.isPowDisplayed = true;
        this.isMapsDisplayed = true;
      } else {
        this.isColorDisplayed = true;
        this.isPowDisplayed = true;
        this.isMapsDisplayed = true;
      }
      if (this.game.players.size == 1 && this.game.players.has(this.user.userId) == false) { // If the client can join
        this.isJoinBtnDisplayed = true;
      } else { 
        this.isJoinBtnDisplayed = false;
      }
    },
    updateDisplayedElem(): void {
      if (this.game.type === "matchmaking") {
        this.displayMatchmaking();
      } else if (this.game.type === "private") {
        this.displayPrivateGame();
      }
    },
    getCreatorColor(): string {
      if (this.game.creator === this.user.userId && this.game.players.has(this.user.userId) === true) {
        const player: Player | undefined = this.game.players.get(this.game.creator);
        if (player)
          return (player.color);
      } else { // Default behavior
        console.warn("WARN: creator not detected in the game class");
      }
      return ('grey'); // Default color
    },
    getSecondPlayerColor(): string {
      if (this.game.opponent != "") {
        const player: Player | undefined = this.game.players.get(this.game.opponent);
        if (player)
          return (player.color);
      }
      return ('grey');
    }
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

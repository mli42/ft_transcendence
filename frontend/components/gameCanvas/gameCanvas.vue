<template>
  <div data-app>
  <v-app>
    <v-btn v-on:click="isGameDisplayedNeg">SHOW/HIDE THE GAME</v-btn>
    <hr>
    <div id="gameSettings">
      <h1>User settings</h1>
      <!-- GAME TYPE SELECTION -->
      <div id="type">
        <v-card>
          <v-tabs
            id="typeSelection"
            class="typeSelection"
            center-active
            v-model="tabTypesIndex"
          >
            <v-tab v-bind:disabled="isTabsEnabled" @click="changeGameType('matchmaking')">Matchmaking</v-tab>
            <v-tab v-bind:disabled="isTabsEnabled" @click="changeGameType('private')">Private Game</v-tab>
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
        <v-sheet v-bind:color="barColor"></v-sheet>
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
          v-bind:color="this.creatorColor"
        >
          <v-icon v-if="creatorName" left>mdi-account-circle-outline</v-icon>
          {{ creatorName }}
        </v-chip>
        <v-chip
          label
          v-bind:color="this.opponentColor"
        >
          <v-icon v-if="opponentName" left>mdi-account-circle-outline</v-icon>
          {{ opponentName }}
        </v-chip>
      </div>
      <!-- MAIN BUTTON -->
      <div id="mainBtn">
        <v-btn
          id="mainBtn"
          v-bind:color="mainBtnColor"
          v-bind:class="mainBtnClass"
          v-if="isMainBtnDisplayed"
          @click="mainBtnAction"
        >{{ this.mainBtnTxt }}
        <v-icon>{{ this.mainBtnIco}}</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-show="isGameDisplayed" id="gameCanvas">
    </div>
  </v-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Game, Player, IcolorPalette} from "./dataStructures";
import lookup from "socket.io-client";
import { use } from "vue/types/umd";
import { socket, socketInit } from "./socket"
import { sketch } from "./sketch";

export { SOCKET_URL };

const SOCKET_URL:string = "ws://localhost:3000/";

let uiPalette: IcolorPalette = {} as IcolorPalette;
uiPalette["green"] = "#219653"; uiPalette["white"] = "#DCE1E5";
uiPalette["red"] = "#B30438";

let playerPalette: IcolorPalette = {} as IcolorPalette;
playerPalette["Red"] = "#FA163F"; playerPalette["Green"] = "#54E346";
playerPalette["Blue"] = "#3EDBF0"; playerPalette["Yellow"] = "#FFF338";
playerPalette["Purple"] = "#D62AD0"; playerPalette["Pink"] = "#FB7AFC";

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
      // Condition to display or not element. Modified by display* methods
      isPowDisplayed: false as boolean,
      isGameDisplayed: false as boolean,
      isMapsDisplayed: false as boolean,
      isColorDisplayed: true as boolean,
      isMainBtnDisplayed: false as boolean,
      // model to typeSelection tabs
      tabTypesIndex: 0 as number,
      // Text of the button when it is displayed
      mainBtnTxt: "" as string,
      // Icon of this button
      mainBtnIco: "" as string,
      // Color of this button
      mainBtnColor: "grey" as string,
      // Action when the main button is pressed
      mainBtnAction: function () {},
      mainBtnClass: {'v-btn-content': false},
      tabTypes: ["matchmaking", "private"] as Array<string>,
      creatorColor: "" as string,
      creatorName: "" as string,
      opponentColor: "" as string,
      opponentName: "" as string,
      barColor: "" as string,
    }
  },
  async mounted() {
    // Connect to the websocket & fetch remote game class
    socketInit(SOCKET_URL, this.gameId, this);
    console.log(this);
    socket.emit("fetchGameTS", this.gameId);
    // Start the sketch
    const { default: P5 } = await import('p5');
    const canvas = new P5(sketch, document.getElementById('gameCanvas') as HTMLElement);
  },
  methods: {
    isGameDisplayedNeg(): void { // Negative the boolean to display the canvas
      this.isGameDisplayed = !this.isGameDisplayed;
    },
    changeGameType(type: string): void {
      if (this.user.userId === this.game.creatorId) {
        socket.emit("changeGameTypeTS", type);
        this.game.type = type;
        if (type === "matchmaking") {
          this.tabTypesIndex = 0;
        } else if (type === "private") {
          this.tabTypesIndex = 1;
        }
        if (this.game.opponentId != "") {
          this.game.players.delete(this.game.opponentId);
          this.game.opponentId = "";
        }
        this.updateDisplayedElem();
      }
    },
    changePlayerColor(color: string): void {
      let currPlayer: Player | undefined = this.game.players.get(this.user.userId);
      if (currPlayer) {
        currPlayer.color = playerPalette[color];             // Update in player class
        this.playerColorClass = "player" + color;   // Update bar color
        if (this.user.userId == this.game.creatorId) {
          this.creatorColor = playerPalette[color];
        } else {
          this.opponentColor = playerPalette[color];
        }
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
        this.isMainBtnDisplayed = true;
      } else {
        this.isColorDisplayed = false;
      }
      if (this.game.creatorId == this.user.userId) {
        this.isMainBtnDisplayed = true;
      } else {
        this.isMainBtnDisplayed = false;
      }
      this.isPowDisplayed = false;
      this.isMapsDisplayed = false;
    },
    displayPrivateGame(): void {
      this.isMainBtnDisplayed = true;
      if (this.game.players.has(this.user.userId) === true) { // If the current client is a player
        this.isColorDisplayed = true;
        this.isPowDisplayed = true;
        this.isMapsDisplayed = true;
      } else {
        this.isColorDisplayed = false;
        this.isPowDisplayed = false;
        this.isMapsDisplayed = false;
      }
      if (this.game.players.size == 1) { // If the game is not full
        if (this.game.players.has(this.user.userId) == false) { // If the current user is not the creator
          this.mainBtnTxt = "JOIN THE GAME";
          this.mainBtnColor = uiPalette["green"];
          this.mainBtnClass["v-btn-content"] = false;
          this.mainBtnAction = this.btnActionJoin;
        } else {
          this.mainBtnTxt = "Invite a player";
          this.mainBtnColor = uiPalette["white"];
          this.mainBtnClass["v-btn-content"] = true;
        }
      } else {                           // If the game is full
        if (this.game.players.has(this.user.userId) == false) { // Waiting for players to be ready
          this.mainBtnTxt = "WAITING FOR PLAYERS";
          this.mainBtnColor = uiPalette["white"];
          this.mainBtnAction = function () {};
          this.mainBtnClass["v-btn-content"] = true;
        } else {                                                  // Display a button for player to set as ready
          this.mainBtnTxt = "READY ?";
          this.mainBtnColor = uiPalette["green"];
          this.mainBtnClass["v-btn-content"] = false;
          this.mainBtnAction = this.btnActionReady;
        }
      }
    },
    updateDisplayedElem(): void {
      if (this.game.type === "matchmaking") {
        this.displayMatchmaking();
      } else if (this.game.type === "private") {
        this.displayPrivateGame();
      }
      if (this.game.type == "matchmaking") {
        this.tabTypesIndex = 0;
      } else if (this.game.type == "private") {
        this.tabTypesIndex = 1;
      }
      this.creatorName = this.game.players.get(this.game.creatorId)?.name || "";
      this.opponentName = this.game.players.get(this.game.opponentId)?.name || "";
      this.updatePlayersColors();
    },
    updatePlayersColors(): void {
      this.creatorColor = this.game.players.get(this.game.creatorId)?.color || "black";
      this.opponentColor = this.game.players.get(this.game.opponentId)?.color || "black";
      this.barColor = this.game.players.get(this.user.userId)?.color || "black";
    },
    btnActionJoin(): void { // Action to join the game as an opponent player
      console.log("LOG: button action join");
      let player: Player | undefined;

      this.game.opponentId = this.user.userId;
      this.game.players.set(this.user.userId, new Player());
      player = this.game.players.get(this.user.userId);
      if (player) {
        player.name = this.user.username;
        player.color = playerPalette["Blue"];
        socket.emit("playerJoinTS", player);
      }
      this.updateDisplayedElem();
    },
    btnActionLeave(): void {  // Action to leave the game as a player
      this.game.opponentId = "";
      this.game.players.delete(this.user.userId);
      socket.emit("playerLeaveTS", this.user.userId);
    },
    btnActionInvite(): void { // Action to copy the link in the user clipboard

    },
    btnActionSearch(): void { // Action to start matchmaking to find someone to play

    },
    btnActionReady(): void {  // Action to send to the server the information about the current player is ready
      // const gameId: string = this.gameId;
      // let player: Player | undefined = this.game.players.get(this.user.userId);

      // if (player) {
      //   player.isReady = !player.isReady;
      //   socket.emit("updateReadyTS", {gameId: gameId, isReady: player.isReady});
      // }
    },
  },
  computed: {
    isTabsEnabled: function () : boolean {
      if (this.game.creatorId == this.user.userId) {
        return (false);
      }
      return (true);
    },
  },
  watch: {
    "game": function(): void {
      this.updateDisplayedElem();
    },
    "game.type": function(): void {
      this.updateDisplayedElem();
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
    },
  }
},
);
</script>

<style scoped lang="scss" src="./gameCanvas.scss">

</style>

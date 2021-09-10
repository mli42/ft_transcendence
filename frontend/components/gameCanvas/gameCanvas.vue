<template>
  <div data-app>
  <v-app id="vappMain">
    <div id="gameSettings" v-if="this.isPreGameDisplayed" class="useWholePage flexHVcenter">
      <div id="preGame">
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
          @change="updatePow"
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
          @change="updateMap"
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
          <v-icon v-if="isCreatorReady" left>mdi-check</v-icon>
          <v-icon v-else left>mdi-dots-horizontal</v-icon>
          {{ creatorName }}
        </v-chip>
        <v-chip
          label
          v-bind:color="this.opponentColor"
        >
          <v-icon v-if="isOpponentReady" left>mdi-check</v-icon>
          <v-icon v-else left>mdi-dots-horizontal</v-icon>
          {{ opponentName }}
        </v-chip>
      </div>
      <!-- MAIN BUTTON -->
      <div id="mainBtn" @mouseenter="mainBtn.actionHoverEnter" @mouseleave="mainBtn.actionHoverLeave">
        <v-btn
          id="mainBtnVueT"
          v-bind:color="mainBtn.color"
          v-bind:class="mainBtn.class"
          v-bind:loading="mainBtn.isLoading"
          v-if="this.mainBtn.txt"
          @click="mainBtn.action"
        >{{ this.mainBtn.txt }}
          <v-icon>{{ this.mainBtn.ico}}</v-icon>
        </v-btn>
      </div>
      </div>
    </div>
    <div v-show="isGameDisplayed" >
      <div id="gameCanvas" class="useWholePage flexHVcenter" >
        <div id="gameHUD" class="flexHVcenter">

          <div id="gameInfos" class="flexAlignRow">
            <p class="txtHUD" :style="[creatorTxtStyle]">{{creatorName}}</p>
            <p class="txtHUD" :style="[creatorTxtStyle]">{{game.score[0]}}</p>
            <p class="txtHUD" :style="[oppoTxtStyle]">{{game.score[1]}}</p>
            <p class="txtHUD" :style="[oppoTxtStyle]">{{opponentName}}</p>
          </div>

        </div>
      </div>
    </div>
  </v-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Game, Player, IcolorPalette, Button} from "./dataStructures";
import lookup from "socket.io-client";
import { use } from "vue/types/umd";
import { socket, socketInit } from "./socket"
import { sketchWrap, p5Instance } from "./sketch";

export { SOCKET_URL };

const SOCKET_URL: string = `ws://${window.location.hostname}:3000/game`;

const uiPalette: IcolorPalette = {
  green: "#219653", white: "#DCE1E5", red: "#B30438",
};

const playerPalette: IcolorPalette = {
  Red: "#FA163F", Green: "#54E346", Blue: "#3EDBF0", Yellow: "#FFF338",
  Purple: "#D62AD0", Pink: "#FB7AFC",
};

export default Vue.extend({
  name: "gameCanvas" as string,
  data() {
    return {
      game: new Game(), // Must be assignated by the server data
      gameId: this.$route.params.id as string,
      user: this.$store.state.user as any,
      mapNames: [] as string[],
      playerColorClass: "playerRed",
      playersList: {} as Array<any>,
      powList: [
        "➕ ball size up", "➖ ball size down", "⚡ bar speed up", "↔️ lenght up", "🔥 FIRE !"
      ],
      // Condition to display or not element. Modified by display* methods
      isPowDisplayed: false as boolean,
      isGameDisplayed: false as boolean,
      isMapsDisplayed: false as boolean,
      isColorDisplayed: false as boolean,
      isPreGameDisplayed: false as boolean,
      // model to typeSelection tabs
      tabTypesIndex: 0 as number,
      mainBtn: new Button(),
      tabTypes: ["matchmaking", "private"] as Array<string>,
      creatorColor: "" as string,
      creatorName: "" as string,
      isCreatorReady: false as boolean,
      opponentColor: "" as string,
      opponentName: "" as string,
      isOpponentReady: false as boolean,
      barColor: "" as string,
    }
  },
  async mounted() {
    // Fetch map list
    this.$axios.get("/api/game/mapList").then( response => {
      response.data.forEach((mapName: any) => {
        mapName = mapName.substr(0, mapName.lastIndexOf('.')) || mapName;
        mapName = mapName.replace("-", " ");
        this.mapNames.push(mapName);
      });
    });
    // Connect to the websocket & fetch remote game class
    socketInit(SOCKET_URL, this.gameId, this);
    socket.emit("fetchGameTS", this.gameId); // This function will ask to the server to fetch game class
  },
  async destroyed() {
    socket.disconnect();
    if (p5Instance != undefined) {
      p5Instance.remove();
    }
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
          if (this.mainBtn.isLoading === true)
            this.btnActionSearchStop();
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
      if (this.game.players.has(this.user.userId) === true) { // If the current client is a player
        this.isColorDisplayed = true;
      } else {
        this.isColorDisplayed = false;
      }
      if (this.game.creatorId == this.user.userId && this.game.players.size == 1) {
        this.mainBtn.setFull("SEARCH FOR A GAME", "white", this.btnActionSearch);
      } else {
        if (this.game.players.size === 1) {
          this.mainBtn.setFull("WAITING TO FIND A PLAYER", "white");
        } else if (this.game.players.size === 2) {
          this.mainBtn.setFull("THE GAME IS ABOUT TO START", "white");
        } else {
          this.mainBtn.setFull("JOIN THE GAME", "green", this.btnActionJoin);
        }
      }
      this.isPowDisplayed = false;
      this.isMapsDisplayed = false;
    },
    displayPrivateGame(): void {
      if (this.game.players.has(this.user.userId) === true) { // If the current client is a player
        this.isColorDisplayed = true;
        this.isPowDisplayed = true;
        this.isMapsDisplayed = true;
      } else {
        this.isColorDisplayed = false;
        this.isPowDisplayed = false;
        this.isMapsDisplayed = false;
      }
      if (this.game.players.size == 2) {                           // If the game is full
        if (this.game.players.has(this.user.userId) == false) { // Waiting for players to be ready
          this.mainBtn.setFull("WAITING FOR PLAYERS", "white");
        } else {                                                  // Display a button for player to set as ready
          if (this.game.players.get(this.user.userId)?.isReady === true) {
            this.isColorDisplayed = false;
            this.isPowDisplayed = false;
            this.isMapsDisplayed = false;
          } else {
            this.mainBtn.setFull("READY ?", "green", this.btnActionReady);
          }
        }
      } else if (this.game.players.has(this.user.userId) == false) { // If the current user is not the creator
          this.mainBtn.setFull("JOIN THE GAME", "green", this.btnActionJoin);
      } else {
          this.mainBtn.setFull("INVITE A PLAYER", "white", this.btnActionInvite);
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
      this.isCreatorReady = this.game.players.get(this.game.creatorId)?.isReady || false;
      this.opponentName = this.game.players.get(this.game.opponentId)?.name || "";
      this.isOpponentReady = this.game.players.get(this.game.opponentId)?.isReady || false;
      this.updatePlayersColors();
    },
    updatePlayersColors(): void {
      this.creatorColor = this.game.players.get(this.game.creatorId)?.color || "black";
      this.opponentColor = this.game.players.get(this.game.opponentId)?.color || "black";
      this.barColor = this.game.players.get(this.user.userId)?.color || "black";
    },
    updatePow(): void {
      socket.emit("updatePowTS", this.game.enabledPowerUps);
    },
    updateMap(): void {
      socket.emit("updateMapTS", this.game.mapName);
    },
    btnActionJoin(): void { // Action to join the game as an opponent player
      console.log("LOG: button action join");
      let player: Player | undefined;

      if (this.game.creatorId === "") {
        this.game.creatorId = this.user.userId;
      } else {
        this.game.opponentId = this.user.userId;
      }
      this.game.players.set(this.user.userId, new Player());
      player = this.game.players.get(this.user.userId);
      if (player) {
        player.name = this.user.username;
        if (this.game.creatorId == this.user.userId) {
          player.color = playerPalette["Red"]; // default colors
        } else {
          player.color = playerPalette["Blue"]; // default colors
        }
        socket.emit("playerJoinTS", player);
      }
      this.updateDisplayedElem();
    },
    btnActionLeave(): void {  // Action to leave the game as a player
      console.log("LOG: button action leave");
      this.game.opponentId = "";
      this.game.players.delete(this.user.userId);
      socket.emit("playerLeaveTS", this.user.userId);
    },
    btnActionInvite(): void { // Action to copy the link in the user clipboard
      navigator.clipboard.writeText(window.location.href);
      this.$mytoast.succ("URL paste in your clipboard !");
    },
    btnActionSearch(): void { // Action to start matchmaking to find someone to play
      console.log("LOG: button action search");
      this.mainBtn.isLoading = true;
      this.mainBtn.color = "green";
      this.mainBtn.action = this.btnActionSearchStop;
      this.mainBtn.setHoverSearch();
      this.$mytoast.info("Searching for a player...");
      socket.emit("startSearchTS", this.game.players.get(this.user.userId));
    },
    btnActionSearchStop(): void {
      console.log("LOG: button action search stop");
      this.mainBtn.setFull("SEARCH FOR A GAME", "white", this.btnActionSearch);
      this.mainBtn.resetHover(); // Delete actions when the client hover the button
      this.mainBtn.isLoading = false;
      socket.emit("stopSearchTS", this.game.players.get(this.user.userId));
    },
    btnActionReady(): void {  // Action to send to the server the information about the current player is ready
      console.log("LOG: button action ready");
      let player: Player | undefined = this.game.players.get(this.user.userId);

      if (player && player.isReady === false) {
        player.isReady = true;
        socket.emit("updateReadyTS", player.isReady);
        this.updateDisplayedElem();
        this.mainBtn.isLoading = true;
        this.mainBtn.setHoverReady();
        this.mainBtn.action = this.btnActionUnReady;
      }
    },
    btnActionUnReady(): void {  // Action to send to the server the information about the current player is ready
      console.log("LOG: button action unready");
      let player: Player | undefined = this.game.players.get(this.user.userId);

      if (player && player.isReady === true) {
        player.isReady = false;
        socket.emit("updateReadyTS", player.isReady);
        this.mainBtn.resetHover();
        this.mainBtn.color = "green";
        this.mainBtn.txt = "Ready ?";
        this.mainBtn.isLoading = false;
        this.mainBtn.action = this.btnActionReady;
        this.updateDisplayedElem();
      }
    },
    startGame(): void {
      if (this.game.state === "started") {
        this.isGameDisplayed = true;
        this.isPreGameDisplayed = false;
        sketchWrap(this);
      }
    },
    bgImgURL(): string {
      return `url(${this.$axios.defaults.baseURL}/api/game/map/${this.game.mapName.replace(' ', '-')}.png)`;
    },
  },
  computed: {
    isTabsEnabled: function () : boolean {
      if (this.game.creatorId == this.user.userId) {
        return (false);
      }
      return (true);
    },
    creatorTxtStyle(): object {
      return {
        color: this.creatorColor,
      };
    },
    oppoTxtStyle(): object {
      return {
        color: this.opponentColor,
      };
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
        }
      }
    },
  }
},
);
</script>

<style scoped lang="scss" src="./gameCanvas.scss">
</style>

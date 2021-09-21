<template>
  <div data-app>
  <v-app id="vappMain">
    <div id="gameSettings" v-if="this.isPreGameDisplayed" class="useWholePage flexHVcenter">
      <div id="preGame" :style="[preGameHeight]" >
      <!-- GAME TYPE SELECTION -->
      <div id="type">
        <v-card flat>
          <v-tabs id="typeSelection" class="typeSelection" v-model="tabTypesIndex"
            fixed-tabs background-color="#003566" color="white">
            <v-tab :disabled="isTabsEnabled" class="tabType" @click="changeGameType('matchmaking')">Matchmaking</v-tab>
            <v-tab :disabled="isTabsEnabled" class="tabType" @click="changeGameType('private')">Private Game</v-tab>
          </v-tabs>
        </v-card>
      </div>
      <div class="innerSettings flexAlignCol">
      <!-- COLOR SELECTION -->
      <div id="color" v-if="this.isColorDisplayed" class="flexAlignRow">
        <span>
        <p>Choose your color: </p>
        <button class="dot playerRed" @click="changePlayerColor('Red')"></button>
        <button class="dot playerGreen" @click="changePlayerColor('Green')"></button>
        <button class="dot playerBlue" @click="changePlayerColor('Blue')"></button>
        <button class="dot playerYellow" @click="changePlayerColor('Yellow')"></button>
        <button class="dot playerPurple" @click="changePlayerColor('Purple')"></button>
        <button class="dot playerPink" @click="changePlayerColor('Pink')"></button>
        </span>
        <span class="playerBar" :class="playerColorClass" ></span>
      </div>
      <br v-if="isColorDisplayed && !showPrivateSettings" />
      <div id="privateSettings" v-if="showPrivateSettings" class="flexAlignRow">
        <div id="privateSelection" class="flexAlignCol">
          <!-- MAP SELECTION -->
          <div id="map" v-if="this.isMapsDisplayed">
            <label for="mapSelect">Choose a map</label>
            <v-select id="mapSelect" filled dense
              v-model="game.mapName" @change="updateMap"
              item-value="text" :items="mapNames"
            ></v-select>
          </div>
          <!-- POW SELECTION -->
          <div id="pow" v-if="this.isPowDisplayed">
            <v-combobox id="powCombo" multiple outlined small-chips
              label="Choose power-ups" hint="⚠ You can't edit this list"
              :items="powList" v-model="game.enabledPowerUps" @change="updatePow"
            ></v-combobox>
          </div>
        </div> <!-- Private Selection End -->
        <img id="mapPreview" :src="mapPreviewURL" alt="map preview" title="Map Preview">
      </div> <!-- Private Settings End -->
      <div>
      <!-- LIST OF THE CURRENT PLAYERS IN THE GAME  -->
      <div id="playersList" class="flexAlignRow">
        <v-chip label class="playerPlaying" >
          <v-icon v-if="isCreatorReady" left>mdi-check</v-icon>
          <v-icon v-else left>mdi-dots-horizontal</v-icon>
          <p :style="creatorTxtStyle">{{ creatorName }}</p>
        </v-chip>
        <span id="VS">VS</span>
        <v-chip label class="playerPlaying" >
          <v-icon v-if="isOpponentReady" left>mdi-check</v-icon>
          <v-icon v-else left>mdi-dots-horizontal</v-icon>
          <p :style="oppoTxtStyle">{{ opponentName }}</p>
        </v-chip>
      </div>
      <br />
      <!-- MAIN BUTTON -->
      <div id="mainBtn" @mouseenter="mainBtn.actionHoverEnter" @mouseleave="mainBtn.actionHoverLeave">
        <v-btn id="mainBtnVueT" v-if="this.mainBtn.txt"
          :color="mainBtn.color" :class="mainBtn.class"
          :loading="mainBtn.isLoading" @click="mainBtn.action" >
          {{ this.mainBtn.txt }}
          <v-icon>{{ this.mainBtn.ico}}</v-icon>
        </v-btn>
      </div>
      </div> <!-- Div containing list of players + mainBtn End -->
      </div> <!-- InnerSettingsEnd -->
      </div> <!-- #preGame End -->
    </div> <!-- #gameSettings End -->
    <div v-show="isGameDisplayed" >
      <div id="gameCanvas" class="useWholePage flexHVcenter" >
        <div id="gameHUD" class="flexHVcenter">

          <div v-if="endGame.isFinished == false" id="gameInfos" class="flexAlignRow cantSelect">
            <p class="txtHUD txtHUDName" :style="[creatorTxtStyle]" style="text-align: end;" >{{creatorName}}</p>
            <p class="txtHUD txtHUDScore" :style="[creatorTxtStyle]" style="text-align: end;" >{{game.score[0]}}</p>
            <p class="txtHUD txtHUDScore" :style="[oppoTxtStyle]">{{game.score[1]}}</p>
            <p class="txtHUD txtHUDName" :style="[oppoTxtStyle]">{{opponentName}}</p>
          </div>
          <div v-else id="finalCard">
            <!-- Background Green/Red -->
            <div class="finalGreen"></div> <div class="finalRed"></div>
            <div id="endGameInfos" class="flexAlignCol">
              <div class="endUpInfos">
                <p class="endGameMainInfo">{{endGame.winner.username}}</p>
                <p class="eloHUD">elo {{endGame.winner.elo}} + {{endGame.eloDiff}}</p>
              </div>

              <div class="endMidInfos flexAlignRow">
                <h3 class="endGameMainInfo">{{endGame.winner.score}}</h3>
                <p class="endGameMainInfo">VS</p>
                <h3 class="endGameMainInfo">{{endGame.loser.score}}</h3>
              </div>

              <div class="endBotInfos">
                <p class="eloHUD">elo {{endGame.loser.elo}} - {{endGame.eloDiff}}</p> <br />
                <p class="endGameMainInfo">{{endGame.loser.username}}</p>
              </div>
            </div> <!-- EndGameInfos End -->
          </div> <!-- Final Card End -->
        </div>
      </div>
    </div>
  </v-app>
  <v-overlay v-if="activeCounter"></v-overlay>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Game, Player, IstringsAssociation, Button} from "./dataStructures";
import lookup from "socket.io-client";
import { use } from "vue/types/umd";
import { socket, socketInit } from "./socket"
import { sketchWrap, p5Instance } from "./sketch";

export { SOCKET_URL };

const SOCKET_URL: string = `ws://${window.location.hostname}:3000/game`;

const uiPalette: IstringsAssociation = {
  green: "#219653", white: "#DCE1E5", red: "#B30438",
};

const playerPalette: IstringsAssociation = {
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
        "ball size up", "ball size down", "bar speed up", "length up"
      ],
      // Condition to display or not element. Modified by display* methods
      isPowDisplayed: false as boolean,
      isGameDisplayed: false as boolean,
      isMapsDisplayed: false as boolean,
      isColorDisplayed: false as boolean,
      isPreGameDisplayed: false as boolean,
      // display a counter
      activeCounter: false as boolean,
      // model to typeSelection tabs
      tabTypesIndex: 0 as number,
      mainBtn: new Button(),
      tabTypes: ["matchmaking", "private"] as Array<string>,
      creatorColor: "" as string,
      creatorName: "" as string,
      creatorElo: -1 as number,
      isCreatorReady: false as boolean,
      opponentColor: "" as string,
      opponentName: "" as string,
      opponentElo: -1 as number,
      isOpponentReady: false as boolean,
      barColor: "" as string,
      endGame: {
        isFinished: false as boolean,
        eloDiff: '...' as string,
        winner: {
          username: '' as string,
          score: 0 as number,
          elo: '...' as string,
        },
        loser: {
          username: '' as string,
          score: 0 as number,
          elo: '...' as string,
        },
      } as any,
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
    socket.on("endGameTC", () => {
      this.endGame.isFinished = true;
      const isCreatorWinner: boolean = (this.game.score[0] > this.game.score[1]);
      const eloReq: string = isCreatorWinner ? `${this.creatorElo}/${this.opponentElo}` : `${this.opponentElo}/${this.creatorElo}`;
      let creatorEndGameInfos: any = isCreatorWinner ? this.endGame.winner : this.endGame.loser;
      let opponentEndGameInfos: any = isCreatorWinner ? this.endGame.loser : this.endGame.winner;

      this.$axios.get(`/api/user/calculElo/${eloReq}`)
      .then((res: any) => {
        this.endGame.eloDiff = res.data;
      })
      .catch(this.$mytoast.defaultCatch);
      creatorEndGameInfos.username = this.creatorName;
      creatorEndGameInfos.elo = this.creatorElo;
      creatorEndGameInfos.score = this.game.score[0];
      opponentEndGameInfos.username = this.opponentName;
      opponentEndGameInfos.elo = this.opponentElo;
      opponentEndGameInfos.score = this.game.score[1];
    });
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
      this.isColorDisplayed = (this.game.players.has(this.user.userId) === true); // If the current client is a player
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
      if (this.game.players.has(this.user.userId) === false) {
        this.game.players.set(this.user.userId, new Player());
      }
      player = this.game.players.get(this.user.userId);
      if (player && player.name === "") {
        player.name = this.user.username;
        if (this.game.creatorId == this.user.userId) {
          player.color = playerPalette["Red"]; // default colors
        } else {
          player.color = playerPalette["Blue"]; // default colors
        }
      }
      socket.emit("playerJoinTS", player);
      this.updateDisplayedElem();
    },
    btnActionLeave(): void {  // Action to leave the game as a player
      console.log("LOG: button action leave");
      this.game.opponentId = "";
      this.game.players.delete(this.user.userId);
      socket.emit("playerLeaveTS", this.user.userId);
    },
    btnActionInvite(): void { // Action to copy the link in the user clipboard
      try {
        navigator.clipboard.writeText(window.location.href);
        this.$mytoast.succ("URL paste in your clipboard !");
      } catch (e: any) {
        this.$mytoast.err('Invite through chat please');
      }
    },
    btnActionSearch(): void { // Action to start matchmaking to find someone to play
      console.log("LOG: button action search");
      this.isColorDisplayed = false;
      this.mainBtn.isLoading = true;
      this.mainBtn.color = "green";
      this.mainBtn.action = this.btnActionSearchStop;
      this.mainBtn.setHoverSearch();
      this.$mytoast.info("Searching for a player...");
      socket.emit("startSearchTS", this.game.players.get(this.user.userId));
    },
    btnActionSearchStop(): void {
      console.log("LOG: button action search stop");
      this.isColorDisplayed = true;
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
    showPrivateSettings(): boolean {
      return (this.isMapsDisplayed || this.isPowDisplayed);
    },
    preGameHeight(): object {
      return {
        height: (this.showPrivateSettings) ? '580px' : '340px',
      };
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
    mapPreviewURL(): string {
      return `${this.$axios.defaults.baseURL}/api/game/smallMap/${this.game.mapName.replace(' ', '-')}.png`;
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
    "game.creatorId": function (): void {
      if (!this.game.creatorId) {
        return ;
      }
      this.$axios.get(`/api/user/partialInfo?userId=${this.game.creatorId}`)
      .then((res: any) => {
        const user = res.data;
        this.creatorElo = user.elo;
      })
      .catch(this.$mytoast.defaultCatch);
    },
    "game.opponentId": function (): void {
      if (!this.game.opponentId) {
        return ;
      }
      this.$axios.get(`/api/user/partialInfo?userId=${this.game.opponentId}`)
      .then((res: any) => {
        const user = res.data;
        this.opponentElo = user.elo;
      })
      .catch(this.$mytoast.defaultCatch);
    },
  },
},
);
</script>

<style scoped lang="scss" src="./gameCanvas.scss">
</style>

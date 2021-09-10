export {Ball, Game, PowerUp, Mouse, Player, IcolorPalette}

interface IcolorPalette {
  [index: string]: string;
}

class Mouse {
  x: number;
  y: number;
  playerId: string;

  constructor(id: string, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.playerId = id;
  }
}

// This class contain all data to represente a ball
class Ball {
  pos: Array<number>; // x -> [0] y -> [1]
  size: number; // in px
  speed: number;
  color: string; // in hexa + alpha
  delta: Array<number>; // x -> [0] y -> [1]

  constructor() {
    this.pos = [768 / 2, 432 / 2];
    this.size = 16;
    this.speed = 5;
    this.color = "#DCE1E5";
    this.delta = [0, 0];
  }
}

class Player {
  name: string;
  barX: number;     // Init bar X. Will be set in the game if the player is crea or opponent
  barY: number;     // Init bar Y. Same for two players
  color: string;
  barLen: number;   // in px
  isReady: boolean; // is player ready to start a game ?
  barSpeed: number; // Factor of the bar speed. Each keyboard input = 2px * barSpeed

  constructor() {
    this.name = "";
    this.barX = 0;
    this.barY = 432 / 2;
    this.color = "#FA163F";
    this.barLen = 64; // in px
    this.isReady = false;
    this.barSpeed = 1;
  }
}

// This class contain all data to represent a game.
class Game {
  id: string;
  ball: Ball;
  type: string;                 // Type of the game. Matchmaking | Private
  state: string;
  score: Array<number>;
  mapName: string;
  players: Map<string, Player>; // string -> userId
  startDate: Date;              // Date of the game start
  creatorId: string;            // The userId of the game creator
  opponentId: string;           // The userId of the opponenent;
  modBarCrea: () => void;         // Bar modifier functions
  modBarOppo: () => void;
  creationDate: Date;
  opponentIdFound: string;
  enabledPowerUps: Array<string>;

  /**
 * Function that return true if the bar will go out of the game canvas
 */
   readonly protecUp = (p: Player): boolean => { if (p.barY - (p.barLen / 2) < 0) { return (true) } else { return (false); } };
   readonly protecDown = (p: Player): boolean => { if (p.barY + (p.barLen / 2) > 432) { return (true) } else { return (false); } };

   /**
    * MODIFIER BAR FUNCTIONS
    * These functions move the bar up or down.
    */
   readonly modifierUpCrea = () => {
     const temp: Player | undefined = this.players.get(this.creatorId);
     let player: Player = new Player();

     if (temp != undefined)
       player = temp;
     if (this.protecUp(player) === true) {
       return;
     }
     player.barY -= 4 * player.barSpeed;
   };

   readonly modifierDownCrea = () => {
     const temp: Player | undefined = this.players.get(this.creatorId);
     let player: Player = new Player();

     if (temp != undefined)
       player = temp;
     if (this.protecDown(player) === true) {
       return;
     }
     player.barY += 4 * player.barSpeed;
   };

   readonly modifierUpOppo = () => {
     const temp: Player | undefined = this.players.get(this.opponentId);
     let player: Player = new Player();

     if (temp != undefined)
       player = temp;
     if (this.protecUp(player) === true) {
       return;
     }
     player.barY -= 4 * player.barSpeed;
   };

   readonly modifierDownOppo = () => {
     const temp: Player | undefined = this.players.get(this.opponentId);
     let player: Player = new Player();

     if (temp != undefined)
       player = temp;
     if (this.protecDown(player) === true) {
       return;
     }
     player.barY += 4 * player.barSpeed;
   };

  constructor(creatorId: string, creatorName: string, gameId: string) {
    this.id = gameId;
    this.ball = new Ball();
    this.type = "matchmaking";
    this.state = "waiting";
    this.score = [0, 0] as Array<number>;
    this.mapName = "retro";
    this.players = new Map();
    this.players.set(creatorId, this.assignPlayer(creatorName));
    this.startDate = new Date();
    this.creatorId = creatorId;
    this.opponentId = "";
    this.modBarCrea = function () { };
    this.modBarOppo = function () { };
    this.creationDate = new Date();
    this.opponentIdFound = "";
    this.enabledPowerUps = new Array<string>();
  }

  assignPlayer(playerName: string): Player {
    let newPlayer: Player = new Player();

    newPlayer.name = playerName;
    return (newPlayer);
  }
}

// This class contain all data to represente a powerUp
class PowerUp {
  pos: Array<number>;
  name: string;
  modifier: ((game: Game) => void);

  constructor() {
    this.pos = [0, 0];
    this.name = "";
    this.modifier = () => {};
  }
}

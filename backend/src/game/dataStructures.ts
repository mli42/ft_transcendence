export {Ball, Game, PowerUp, Mouse, Player, IcolorPalette}

const GRID_WIDTH = 768;
const GRID_HEIGHT = 432;

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
    this.pos = [GRID_WIDTH / 2, GRID_HEIGHT / 2];
    this.size = 16;
    this.speed = 3;
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

interface ItypePow {
  [index: string]: ((game: Game, userId?: string | undefined) => void);
}

/**
 * POWER UP
 * To change the effect of the powerUp, change the type and the method will
 * automaticly change. see type setter
 */
class PowerUp {
  pos: Array<number>;
  size: number;
  color: string;
  modifier: ((game: Game, userId?: string | undefined) => void);

  private _type: string;
  private _powMatch: ItypePow;
  private _colorMatch: IcolorPalette;
  private _powList: Array<string>;

  constructor() {
    this.pos = [0, 0];
    this.size = 16;
    this.color = "#DCE1E5";
    this._type = "ballSizeUp";
    this._powList = ["ballSizeUp", "ballSizeDown", "barLenUp", "barSpeedUp"];
    this.modifier = () => {};
    this._powMatch = {} as ItypePow;
    this._powMatch["ballSizeUp"] = this.modBallSizeUp;
    this._powMatch["ballSizeDown"] = this.modBallSizeDown;
    this._powMatch["barLenUp"] = this.modBarLenUp;
    this._powMatch["barSpeedUp"] = this.modBarSpeedUp;
    this._colorMatch = {} as IcolorPalette;
    this._colorMatch["ballSizeUp"] = "#DCE1E5";
    this._colorMatch["ballSizeDown"] = "#DCE1E5";
    this._colorMatch["barLenUp"] = "#219653";
    this._colorMatch["barSpeedUp"] = "#219653";
    this.genPos();
    this.genPow();
  }

  private genPow(): void {
    const randNum: number = Math.round(Math.random() * 1000);
    this.type = this._powList[randNum % this._powList.length];
  }

  // This function generate a position 
  private genPos(): void {
    const H_PADDING = 52;
    const V_PADDING = 32;
    const widthRange: Array<number> = [0 + H_PADDING, GRID_WIDTH - H_PADDING];
    const heightRange: Array<number> = [0 + V_PADDING, GRID_WIDTH - V_PADDING];

    this.pos[0] = Math.random() * GRID_WIDTH;
    while (this.pos[0] < widthRange[0] || this.pos[0] > widthRange[1]) {
      this.pos[0] = Math.random() * GRID_WIDTH;
    }
    this.pos[1] = Math.random() * GRID_HEIGHT;
    while (this.pos[1] < heightRange[0] || this.pos[1] > heightRange[1]) {
      this.pos[1] = Math.random() * GRID_HEIGHT;
    }
  }

  public get type(): string {
    return (this._type);
  }

  public set type(type: string) {
    this._type = type;
    this.modifier = this._powMatch[type];
    this.color = this._colorMatch[type];
  }

  modBallSizeUp(game: Game): void {
    game.ball.size *= 1.25;
  }

  modBallSizeDown(game: Game): void {
    game.ball.size *= 0.75;
  }

  modBarLenUp(game: Game, userId?: string | undefined): void {
    let player: Player | undefined;

    if (userId == undefined)
      return ;
    player = game.players.get(userId);
    if (player) {
      player.barLen *= 1.25;
    }
  }

  modBarSpeedUp(game: Game, userId?: string | undefined): void {
    let player: Player | undefined;

    if (userId == undefined)
      return ;
    player = game.players.get(userId);
    if (player) {
      player.barSpeed *= 1.25;
    }
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
  powerUps: Array<PowerUp>;
  startDate: Date;              // Date of the game start
  creatorId: string;            // The userId of the game creator
  opponentId: string;           // The userId of the opponenent;
  modBarCrea: number;         // Bar modifier functions
  modBarOppo: number;
  creationDate: Date;
  opponentIdFound: string;
  enabledPowerUps: Array<string>;

  constructor(creatorId: string, creatorName: string, gameId: string) {
    this.id = gameId;
    this.ball = new Ball();
    this.type = "matchmaking";
    this.state = "waiting";
    this.score = [0, 0] as Array<number>;
    this.mapName = "retro";
    this.players = new Map();
    this.players.set(creatorId, this.assignPlayer(creatorName));
    this.powerUps = new Array();
    this.startDate = new Date();
    this.creatorId = creatorId;
    this.opponentId = "";
    this.modBarCrea = 0;
    this.modBarOppo = 0;
    this.creationDate = new Date();
    this.opponentIdFound = "";
    this.enabledPowerUps = new Array<string>();
  }

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

  assignPlayer(playerName: string): Player {
    let newPlayer: Player = new Player();

    newPlayer.name = playerName;
    return (newPlayer);
  }
}

export { Ball, Game, PowerUp, Player, IcolorPalette, Button }

/**
 * 🔽 UI STRUCTURES 🔽
 */

interface IcolorPalette {
  [index: string]: string;
}

class Button {
  txt: string;
  ico: string;        // Name of an icon in the button
  class: any;         // List of HTML classes of this object
  action: () => void; // function called when the btn is clicked
  actionHoverEnter: () => void; // function called when the client hover the button
  actionHoverLeave: () => void; // function called when the client hover the button
  isLoading: boolean;
  uiPalette: IcolorPalette;

  private _color: string;

  constructor() {
    this.uiPalette = {} as IcolorPalette;
    this.uiPalette["green"] = "#219653"; this.uiPalette["white"] = "#DCE1E5";
    this.uiPalette["red"] = "#B30438";
    this.txt = "";
    this.ico = "";
    this.class = { 'v-btn-content': false };
    this._color = this.uiPalette["white"];
    this.action = function () { };
    this.actionHoverEnter = function () { };
    this.actionHoverLeave = function () { };
    this.isLoading = false;
  }

  public get color(): string {
    return (this._color);
  }

  public set color(color: string) {
    this._color = this.uiPalette[color];
    if (color === "white") {
      this.class['v-btn-content'] = true;
    } else {
      this.class['v-btn-content'] = false;
    }
  }

  public setFull(txt: string, color: string, action?: () => void): void {
    this.txt = txt;
    this.color = color;
    if (action) {
      this.action = action;
    } else {
      this.action = function () { };
    }
  }

  public setHoverSearch() {
    this.actionHoverLeave = () => {
      this.isLoading = true;
      this.color = "green";
    };
    this.actionHoverEnter = () => {
      this.isLoading = false;
      this.txt = "Stop the research"
      this.color = "red";
    };
  }

  public setHoverReady() {
    this.actionHoverLeave = () => {
      this.isLoading = true;
      this.color = "green";
    };
    this.actionHoverEnter = () => {
      this.isLoading = false;
      this.txt = "Unready"
      this.color = "red";
    };
  }

  public resetHover() {
    this.actionHoverLeave = () => { };
    this.actionHoverEnter = () => { };
  }
}

/**
 * 🔽 GAME DATA STRUCTURES 🔽
 */

const GRID_WIDTH = 768;
const GRID_HEIGHT = 432;

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
  type: string;
  color: string;
  modifier: ((game: Game, userId?: string | undefined) => void);

  powList: Array<string>;
  powMatch: ItypePow;
  colorMatch: IcolorPalette;

  constructor() {
    // DEFAULT
    this.pos = [0, 0];
    this.size = 16;
    this.color = "";
    this.type = "";
    this.modifier = () => {};
    this.powList = ["ballSizeUp", "ballSizeDown", "barLenUp", "barSpeedUp"];
    // CREATE ASSOCIATION TABLES
    this.powMatch = {} as ItypePow;
    this.powMatch["ballSizeUp"] = this.modBallSizeUp;
    this.powMatch["ballSizeDown"] = this.modBallSizeDown;
    this.powMatch["barLenUp"] = this.modBarLenUp;
    this.powMatch["barSpeedUp"] = this.modBarSpeedUp;
    this.colorMatch = {} as IcolorPalette;
    this.colorMatch["ballSizeUp"] = "#DCE1E5";
    this.colorMatch["ballSizeDown"] = "#DCE1E5";
    this.colorMatch["barLenUp"] = "#219653";
    this.colorMatch["barSpeedUp"] = "#219653";
    // INIT VARIABLES
    this.genType();
    this.modifier = this.powMatch[this.type];
    this.color = this.colorMatch[this.type];
    this.genPos();
    console.log(this);
  }

  private genType(): void {
    let randNum: number = Math.round(Math.random() * 10);
    while (randNum < this.powList.length) {
      randNum = Math.round(Math.random() * 10);
    }
    this.type = this.powList[Math.round(randNum % this.powList.length)];
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
    this.pos[0] = Math.round(this.pos[0]);
    this.pos[1] = Math.random() * GRID_HEIGHT;
    while (this.pos[1] < heightRange[0] || this.pos[1] > heightRange[1]) {
      this.pos[1] = Math.random() * GRID_HEIGHT;
    }
    this.pos[1] = Math.round(this.pos[1]);
  }

  modBallSizeUp(game: Game): void {
    game.ball.size *= 2;
  }

  modBallSizeDown(game: Game): void {
    game.ball.size *= 0.5;
  }

  modBarLenUp(game: Game, userId?: string | undefined): void {
    let player: Player | undefined;

    if (userId == undefined)
      return ;
    player = game.players.get(userId);
    if (player) {
      player.barLen *= 2;
    }
  }

  modBarSpeedUp(game: Game, userId?: string | undefined): void {
    let player: Player | undefined;

    if (userId == undefined)
      return ;
    player = game.players.get(userId);
    if (player) {
      player.barSpeed *= 2;
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
  modBarCrea: () => void;         // Bar modifier functions
  modBarOppo: () => void;
  creationDate: Date;
  opponentIdFound: string;
  enabledPowerUps: Array<string>;

  constructor() {
    this.id = "";
    this.ball = new Ball();
    this.type = "matchmaking";
    this.state = "waiting";
    this.score = [0, 0] as Array<number>;
    this.mapName = "retro";
    this.players = new Map();
    this.powerUps = new Array();
    this.startDate = new Date();
    this.creatorId = "";
    this.opponentId = "";
    this.modBarCrea = function () { };
    this.modBarOppo = function () { };
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
}

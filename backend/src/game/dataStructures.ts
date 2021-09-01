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
    this.pos = [1920 / 2, 1016 / 2];
    this.size = 32;
    this.speed = 3;
    this.color = "#DCE1E5FF";
    this.delta = [0, 0];
  }
}

class Player {
  name: string;
  color: string;
  barLen: number; // in px
  isReady: boolean; // is player ready to start a game ?

  constructor() {
    this.name = "";
    this.color = "#FA163F";
    this.barLen = 160; // in px
    this.isReady = false;
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
  creatorId: string;              // The userId of the game creator
  opponentId: string;             // The userId of the opponenent;
  creationDate: Date;
  opponentIdFound: string;
  enabledPowerUps: Array<string>;

  constructor(creatorId: string, creatorName: string, gameId: string) {
    this.id = gameId;
    this.ball = new Ball();
    this.type = "matchmaking";
    this.state = "waiting";
    this.score = [0, 0] as Array<number>;
    this.mapName = "tennis";
    this.players = new Map();
    this.players.set(creatorId, this.assignPlayer(creatorName));
    this.creatorId = creatorId;
    this.opponentId = "";
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

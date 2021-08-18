/*
 * dataStructures.ts
 * File contains all structures used by the game canvas.
 *
 * PO -> playerOne
 * PT -> playerTwo
*/

export default class {}

// This class contain all data to represente a ball
export class Ball {
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

// This class contain all data to represent a game.
export class Game {
  id: string;
  ball: Ball;
  state: string;
  score: Array<number>;
  POName: string;
  PTName: string;
  POColor: string;
  PTColor: string;
  POBarLen: number; // in px
  PTBarLen: number; // in px

  constructor() {
    this.id = "";
    this.ball = new Ball();
    this.state = "waiting";
    this.score = [0, 0] as Array<number>;
    this.POName = "marvin1";
    this.PTName = "marvin2";
    this.PTColor = "#FA163F";
    this.POColor = "#3EDBF0";
    this.POBarLen = 160;
    this.PTBarLen = 160;
  }
}

// This class contain all data to represente a powerUp
export class PowerUp {
  pos: Array<number>;
  name: string;
  modifier: ((game: Game) => void);

  constructor() {
    this.pos = [0, 0];
    this.name = "";
    this.modifier = () => {};
  }
}

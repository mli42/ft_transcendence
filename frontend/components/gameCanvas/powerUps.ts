import {
  Game,
  Ball,
} from "./dataStructures";

export default function dumb(): void {}

function getRandomInt(min: number, max: number): number {
  return (Math.floor((Math.random() * (max - min)) + min));
}

export function powFire(ball: Ball) : void {
  ball.speed += 3;
}

export function powBallSpeed(ball: Ball) : void {
  ball.speed += 3;
}

export function powBallLenUp(game: Game, playerNum: number) : void {
  if (playerNum === 1) {
    game.POBarLen += getRandomInt(10, 30);
  } else if (playerNum === 2) {
    game.PTBarLen += getRandomInt(10, 30);
  }
}

export function powBallSizeUp(ball: Ball) : void {
  ball.size += getRandomInt(1, 10);
}

export function powBallSizeDown(ball: Ball) : void {
  ball.size -= getRandomInt(1, 10);
}

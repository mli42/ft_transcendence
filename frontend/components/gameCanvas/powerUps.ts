import {Game, Ball, Player} from "./dataStructures";

export {getRandomInt, powBallLenUp, powBallSizeDown, powBallSizeUp, powFire, powBallSpeed}

function getRandomInt(min: number, max: number): number {
  return (Math.floor((Math.random() * (max - min)) + min));
}

function powFire(ball: Ball) : void {
  ball.speed += 3;
}

function powBallSpeed(ball: Ball) : void {
  ball.speed += 3;
}

function powBallLenUp(player: Player) : void {
  player.barLen += getRandomInt(10, 30);
}

function powBallSizeUp(ball: Ball) : void {
  ball.size += getRandomInt(1, 10);
}

function powBallSizeDown(ball: Ball) : void {
  ball.size -= getRandomInt(1, 10);
}

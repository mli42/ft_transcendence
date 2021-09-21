import { playingGames } from "./game.gateway";
import { Game, Player, Ball, PowerUp } from "./dataStructures";
import { Socket, Server } from "socket.io";
import { GameService } from "./game.service";
import { User } from "src/user/entities/user.entity";
import { padCollCompute } from "./collisions";

export { gameInstance }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function genRandDelta(score?: Array<number>): Array<number> {
  let ballDelta: Array<number> = new Array();
  let ballDeltaSum: number = 1;
  let ballDeltaRand: number = Math.random();

  while (ballDeltaRand * 10 < 1 || ballDeltaRand * 10 > 5) {      // Ajust to start with a delta more horizontal
    ballDeltaRand = Math.random();
  }
  ballDelta[0] = ballDeltaSum - ballDeltaRand;
  if (Math.round(Math.random())) { ballDelta[0] = -ballDelta[0] } // Add negative ranges between -1 and 0
  ballDelta[1] = ballDeltaRand;
  if (Math.round(Math.random())) { ballDelta[1] = -ballDelta[1] }
  if (score != undefined && score === [0, 0]) {                   // Aim the ball to the creator for the first round
    ballDelta[0] = Math.abs(ballDelta[0]) * -1;
  }
  return (ballDelta);
}

async function gameInstance(client: Socket, game: Game, gameService: GameService): Promise<any> {
  /**
   * ####### GAME SETUP & DECLARATION PART #######
   */
  let ball: Ball = game.ball;
  let pCrea: Player = game.players.get(game.creatorId);
  let pOppo: Player = game.players.get(game.opponentId);
  let collBarChecker: () => void; // Default behavior
  const BAR_WIDTH: number = 4;
  const it = game.players.keys();
  const userOne: User = await gameService.getUser(it.next().value);
  const userTwo: User = await gameService.getUser(it.next().value);

  function resetPowEffect(game: Game): void {
    let pCrea: Player | undefined = game.players.get(game.creatorId);
    let pOppo: Player | undefined = game.players.get(game.opponentId);

    if (pCrea && pOppo) {
      ball.size = 16;
      pCrea.barLen = 80;
      pOppo.barLen = 80;
      pCrea.barSpeed = 1;
      pOppo.barSpeed = 1;
    }
  }

  pCrea.barX = 16 + BAR_WIDTH; // Padding + bar width
  pOppo.barX = 768 - (16 + BAR_WIDTH); // Screen width - (bar width + padding)

  const protecUp = (p: Player): boolean => { if (p.barY - (p.barLen / 2) < 0) { return (true) } else { return (false); } };
  const protecDown = (p: Player): boolean => { if (p.barY + (p.barLen / 2) > 432) { return (true) } else { return (false); } };
  const modifierUpCrea = () => { if (protecUp(pCrea)) { return; } pCrea.barY -= 3 * pCrea.barSpeed; };
  const modifierDownCrea = () => { if (protecDown(pCrea)) { return; } pCrea.barY += 3 * pCrea.barSpeed; };
  const modifierUpOppo = () => { if (protecUp(pOppo)) { return; } pOppo.barY -= 3 * pOppo.barSpeed; };
  const modifierDownOppo = () => { if (protecDown(pOppo)) { return; } pOppo.barY += 3 * pOppo.barSpeed; };

  let padCollision = function (player: Player, isCrea: boolean) {
    // New ball direction
    padCollCompute(ball, player.barY, player.barLen);
    ball.delta[0] = Math.abs(ball.delta[0]);
    if (isCrea === false)
      ball.delta[0] *= -1;
    // Ball general modification
    ball.color = player.color;
    // Broadcast the new ball
    client.to(game.id).emit("changeSettingsTC", { ball: ball });
    client.emit("changeSettingsTC", { ball: ball });
    // Generate a new powerUps
    if (game.enabledPowerUps.length > 0 && (Math.random() * 10) >= 5) {
      let pow = new PowerUp(game.enabledPowerUps, game.powerUps);
      game.powerUps.push(pow);
      client.to(game.id).emit("newPowTC", pow.type, pow.pos);
      client.emit("newPowTC", pow.type, pow.pos);
    }
  }

  let collCreaChecker = function (): void { // Check if the ball collide to the crea paddle
    const halfBar: number = pCrea.barLen / 2;
    const halfBall: number = ball.size / 2;
    if (ball.pos[1] - halfBall >= pCrea.barY - halfBar && ball.pos[1] - halfBall <= pCrea.barY + halfBar ||
      ball.pos[1] + halfBall >= pCrea.barY - halfBar && ball.pos[1] + halfBall <= pCrea.barY + halfBar) { // Vertical check
      if (ball.pos[0] - halfBall <= pCrea.barX + (BAR_WIDTH / 2)) {
        padCollision(pCrea, true);
        collBarChecker = collOppoChecker;
      }
    }
  };

  let collOppoChecker = function (): void { // Check if the ball collide to the oppo paddle
    const halfBar: number = pOppo.barLen / 2;
    const halfBall: number = ball.size / 2;
    if (ball.pos[1] - halfBall >= pOppo.barY - halfBar && ball.pos[1] - halfBall <= pOppo.barY + halfBar ||
      ball.pos[1] + halfBall >= pOppo.barY - halfBar && ball.pos[1] + halfBall <= pOppo.barY + halfBar) { // Vertical check
      if (ball.pos[0] + halfBall >= pOppo.barX - (BAR_WIDTH / 2)) {
        padCollision(pOppo, false);
        collBarChecker = collCreaChecker;
      }
    }
  };

  ball.delta = genRandDelta(game.score);
  if (ball.delta[0] > 0) {
    collBarChecker = collOppoChecker;
  } else {
    collBarChecker = collCreaChecker;
  }

  let checkPowColl = function (ball: Ball): void {
    let i: number = 0;
    let distance: number;

    for (let elem of game.powerUps) {
      distance = Math.sqrt(                        // √((x2−x1)2+(y2−y1)2)
        Math.pow((ball.pos[0] - elem.pos[0]), 2) +
        Math.pow((ball.pos[1] - elem.pos[1]), 2));
      if (Math.abs(distance) <= ball.size) {                 // Collision !
        let userAffected: string = "";
        if (collBarChecker === collCreaChecker) {
          userAffected = game.opponentId;
        } else if (collBarChecker === collOppoChecker) {
          userAffected = game.creatorId;
        }
        elem.modifier(game, userAffected);
        client.to(game.id).emit("collPowTC", elem.pos, userAffected);
        client.emit("collPowTC", elem.pos, userAffected);
        game.powerUps.splice(i, 1);
        return;
      }
      i++;
    }
  }
  /**
   * ####### GAME START #######
   */
  for (let i = 3; i >= 0; i--) {
    await sleep(1000);
    if (i === 0) {
      client.to(game.id).emit("countTC", "GO !");
      client.emit("countTC", "GO !");
    } else {
      client.to(game.id).emit("countTC", `${i}`);
      client.emit("countTC", `${i}`);
    }
  }
  /**
   * ####### GAME LOOP #######
   */
  while (game.score[0] < 7 && game.score[1] < 7) {
    // Temp loop
    await sleep(10);
    // Move bars if needed
    if (game.modBarCrea === 1) { modifierUpCrea(); } else if (game.modBarCrea === -1) { modifierDownCrea(); }
    if (game.modBarOppo === 1) { modifierUpOppo(); } else if (game.modBarOppo === -1) { modifierDownOppo(); }
    // Check collisions between ball and bars
    collBarChecker();
    // Check collision between ball and powerUps
    checkPowColl(ball);
    // Move the ball one step
    ball.pos[0] += ball.delta[0] * ball.speed;
    ball.pos[1] += ball.delta[1] * ball.speed;
    // Check collisions between ball and grid borders
    if (ball.pos[1] - (ball.size / 2) <= 0 || ball.pos[1] + (ball.size / 2) >= 432) { // top & bot collision
      ball.delta[1] *= -1;
    } else if (ball.pos[0] - (ball.size / 2) <= 0 || ball.pos[0] + (ball.size / 2) >= 768) { // left & right collision
      if (ball.pos[0] - (ball.size / 2) <= 0) { // left collision
        game.score[1]++;
      } else {                                  // right collision
        game.score[0]++;
      }
      ball.delta = genRandDelta(game.score);
      ball.delta[0] = Math.abs(ball.delta[0]);
      if (ball.pos[0] - (ball.size / 2) <= 0) { // Redirect the ball to the looser
        ball.delta[0] *= -1;
      }
      ball.pos = [768 / 2, 432 / 2];
      ball.speed = 3;
      if (ball.delta[0] > 0) { collBarChecker = collOppoChecker; } else { collBarChecker = collCreaChecker; }
      ball.color = "#DCE1E5";
      client.to(game.id).emit("changeSettingsTC", { ball: ball });
      client.emit("changeSettingsTC", { ball: ball });
      client.to(game.id).emit("pointTC", game.score); // Update point on front
      client.emit("pointTC", game.score);
      resetPowEffect(game);
    }
    // Broadcast positions
    client.to(game.id).emit("b", { posX: game.ball.pos[0], posY: game.ball.pos[1], barCreaY: pCrea.barY, barOppoY: pOppo.barY });
    client.emit("b", { posX: game.ball.pos[0], posY: game.ball.pos[1], barCreaY: pCrea.barY, barOppoY: pOppo.barY });
  }
  /**
   * ####### GAME END #######
   */
  playingGames.splice(playingGames.lastIndexOf(game.id));
  game.state = "ended";
  gameService.saveGameHistory(game, userOne, userTwo);
  client.to(game.id).emit("endGameTC"); // Update point on front
  client.emit("endGameTC");
  while (game.state != "closed") {
    await sleep(10);
    if (game.modBarCrea === 1) { modifierUpCrea(); } else if (game.modBarCrea === -1) { modifierDownCrea(); }
    if (game.modBarOppo === 1) { modifierUpOppo(); } else if (game.modBarOppo === -1) { modifierDownOppo(); }
    client.to(game.id).emit("b", { posX: -100, posY: -100, barCreaY: pCrea.barY, barOppoY: pOppo.barY });
    client.emit("b", { posX: -100, posY: -100, barCreaY: pCrea.barY, barOppoY: pOppo.barY });
  }
}

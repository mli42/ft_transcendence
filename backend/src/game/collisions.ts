import { Ball } from "./dataStructures";

export { padCollCompute }

/**
 * This function will return the nearest y coord that hit the bar.
 */
function getHitY(ballY: number, ballSize: number, barY: number, barLen: number): number {
  const barRange: Array<number> = [barY - (barLen / 2), barY + (barLen / 2)];

  if (ballY >= barRange[0] && ballY <= barRange[1]) {                              // Center test
    return (ballY);
  } else if (ballY - ballSize >= barRange[0] && ballY - ballSize <= barRange[1]) { // Top test
    return (ballY - ballSize / 2);
  }
  return (ballY + ballSize / 2);
}

/**
 * This function will return a percentage depending on where the ball hit the
 * bar. 0% is the top of the bar and 100% is the bottom.
 * 
 * If it's not the center of the ball that hit the bar, it's the nearest corner
 * of the hit box that taken for ball point
 */
function findPercent(hitY: number, barY: number, barLen: number): number {
  const barYmin: number = barY - (barLen / 2);
  const barYmax: number = barY + (barLen / 2);
  return (((hitY - barYmin) * 100) / (barYmax - barYmin));
}

function findDeltaY(pourcentHit: number): number {
  return ((1 * (pourcentHit / 100)) - 0.5);
}

function findDeltaX(pourcentHit: number): number {
  return (1 - Math.abs(0.5 - (pourcentHit / 100)));
}

/**
 * This function will compute new delta of the ball depending on where the ball
 * hit the player bar.
 * 
 * All calculations are detailed in baguette language here :
 * https://www.notion.so/The-game-a82ae14178f647198e23c4f0b14d7679#4ae112e04b2742cd9cb68d3429071286
 * 
 * @param ball ball that collide with the bar
 * @param barY y position of the bar
 * @param barLen length of the bar
 */
function padCollCompute(ball: Ball, barY: number, barLen: number): void {
  const hitY = getHitY(ball.pos[1], ball.size, barY, barLen);
  const percentHit = findPercent(hitY, barY, barLen);
  let deltaY = findDeltaY(percentHit);
  let deltaX = findDeltaX(percentHit);

  ball.delta[0] = deltaX;
  ball.delta[1] = deltaY;
}

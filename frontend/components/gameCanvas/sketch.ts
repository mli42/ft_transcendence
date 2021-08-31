import { socket } from "./socket";
import * as p5 from "p5";
import { Mouse } from "./dataStructures";

export { sketch };

async function sketch (s: any): Promise<any> {
  let canvasDom: any = document.getElementById("gameCanvas");
  let otherMouses: Map<string, Array<number>> = new Map();
  let myMouse: Mouse = new Mouse(socket.id, 0, 0);

  s.setup = () => {
    s.createCanvas(canvasDom.offsetWidth, canvasDom.offsetHeight);
    socket.on("mousePosToClient", (payload: Mouse) => { // [0]:string [1]:Mouse
      otherMouses.set(payload.playerId, [payload.x, payload.y] as Array<number>);
    });
  }
  s.draw = () => {
    s.background("#00FF00");
    s.ellipse(s.mouseX, s.mouseY, 50, 50);
    socket.emit("mousePosToServer", [s.mouseX, s.mouseY] as Array<number>);
    otherMouses.forEach((value: any) => {
        s.fill("#0000FF");
        if (value)
          s.ellipse(value[0], value[1], 50, 50);
    });
  }
  s.windowResized = () => {
    s.resizeCanvas(canvasDom.offsetWidth, canvasDom.offsetHeight);
  }
}

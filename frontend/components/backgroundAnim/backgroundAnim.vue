<template>
  <div id="canvasAnim"></div>
</template>

<!--
  BACKGROUNDANIM

  This component is an animation of a ball that travel trough the canvas.
  The start and end side are random and a ball cross the screen every minutes.
-->

<script lang="ts">
import Vue from 'vue';
import * as p5 from "p5";

export default Vue.extend ({
  name: 'backgroundAnim',
  async mounted () {
    const { default: P5 } = await import('p5')

    const sketch = (s: any) => {
      let ballSize: number = 30;
      let arrPointGen: { (): p5.Vector; } [] = [ // Get a random point of a screen border
        () => {return (s.createVector(s.random(0, s.width) as Number, -ballSize) as p5.Vector); }, // Top
        () => {return (s.createVector(s.random(0, s.width) as Number, s.height + ballSize) as p5.Vector); }, // Bot
        () => {return (s.createVector(s.width + ballSize, s.random(0, s.height) as Number) as p5.Vector); }, // Right
        () => {return (s.createVector(-ballSize, s.random(0, s.height) as Number) as p5.Vector); } // Left
      ];
      let vectorDest: p5.Vector = s.createVector(0, 0);;
      let vectorSrc: p5.Vector = s.createVector(0, 0);
      let delta: p5.Vector;
      let speed: number = 5;
      let palettePlayers: Array<String> = [
        '#FA163F', '#54E346', '#3EDBF0', '#FFF338', '#D62AD0', '#FB7AFC'
      ];
      let newSrc: p5.Vector; // Position of one step to the destination
      let draw1: number; // Source side selector
      let draw2: number; // Dest side selector
      let d1: number; // Value to get len from Scr to Dst
      let d2: number; // Len of a single step of a single frame
      let fpsCounter: number = 0;

      s.setup = () => {
        s.createCanvas(window.innerWidth, window.innerHeight - 64);
        s.noStroke();
      }
      s.draw = () => {
        s.background('#003566');
        if (fpsCounter == 0 && Math.trunc(s.random(0, 200)) == 42) { // New ball setup
          draw1 = Math.trunc(s.random(0, 4));
          vectorSrc = arrPointGen[draw1]();
          while ((draw2 = Math.trunc(s.random(0, 4))) == draw1)
            ;
          vectorDest = arrPointGen[draw2]();
          s.fill(palettePlayers[Math.trunc(s.random(0, 6))]);
          d1 = vectorSrc.dist(vectorDest);
          delta = p5.Vector.sub(vectorDest, vectorSrc).normalize();
          newSrc = p5.Vector.add(vectorSrc, delta.mult(speed));
          d2 = newSrc.dist(vectorSrc);
          fpsCounter = Math.trunc(d1 / d2);
        }
        else if (fpsCounter > 0) { // Ball progression
          vectorSrc.add(delta);
          fpsCounter--;
          s.ellipse(vectorSrc.x, vectorSrc.y, ballSize, ballSize);
        }
      }
      s.windowResized = () => {
        s.resizeCanvas(window.innerWidth, window.innerHeight - 64);
      }
    };
    // eslint-disable-next-line no-unused-vars
    const canvas = new P5(sketch, document.getElementById('canvasAnim') as HTMLElement);
  },
  destroyed() {
    let elements: any = document.getElementsByClassName('p5Canvas');
    for (let i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
  },
});
</script>

<style lang="scss" src="./backgroundAnim.scss">

</style>

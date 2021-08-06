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
  data() {
    return {
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
        txt: ''
    }
  },
  created() {
    window.addEventListener('resize', () => {
      this.windowHeight = window.screen.height;
      this.windowWidth = window.screen.width;
    })
  },
  async mounted () {
    const { default: P5 } = await import('p5')

    const sketch = (s: any) => {
      let ballSize: number = 30;
      let arrPointGen: { (): p5.Vector; } [] = [
        () => {return (s.createVector(s.random(0, s.width) as Number, 0) as p5.Vector); }, // Top
        () => {return (s.createVector(s.random(0, s.width) as Number, s.height) as p5.Vector); }, // Bot
        () => {return (s.createVector(s.width, s.random(0, s.height) as Number) as p5.Vector); }, // Right
        () => {return (s.createVector(0, s.random(0, s.height) as Number) as p5.Vector); } // Left
      ];

      let vectorDest: p5.Vector = s.createVector(0, 0);;
      let vectorSrc: p5.Vector = s.createVector(0, 0);
      let delta: p5.Vector;
      let speed: number = 5;
      let palette: Array<String> = ['#FA163F', '#54E346', '#3EDBF0', '#FFF338', '#D62AD0', '#FB7AFC'];

      let newSrc: p5.Vector;
      let draw1: number;
      let draw2: number;
      let d1: number;
      let d2: number;
      let fpsCounter: number = 0;

      s.setup = () => {
        s.createCanvas(window.innerWidth, window.innerHeight - 64);
        s.frameRate(60);
      }
      s.draw = () => {
        s.background('grey');
        if (fpsCounter <= 0) {
          draw1 = Math.trunc(s.random(0, 4));
          vectorSrc = arrPointGen[draw1]();
          while ((draw2 = Math.trunc(s.random(0, 4))) == draw1)
            ;
          vectorDest = arrPointGen[draw2]();
          s.fill(palette[Math.trunc(s.random(0, 6))]);
          d1 = vectorSrc.dist(vectorDest);
          delta = p5.Vector.sub(vectorDest, vectorSrc).normalize();
          newSrc = p5.Vector.add(vectorSrc, delta.mult(speed));
          d2 = newSrc.dist(vectorSrc);
          fpsCounter = d1 / d2;
        }
        else {
          delta = p5.Vector.sub(vectorDest, vectorSrc).normalize();
          vectorSrc.add(delta.mult(speed));
          fpsCounter--;
        }
        s.ellipse(vectorSrc.x, vectorSrc.y, 50, 50);
        s.ellipse(s.mouseX, s.mouseY, 20, 20);
      }
      // s.mouseClicked = () => {
      //   let newRect: p5.Vector = arrPointGen[Math.trunc(s.random(0, 4))]();
      //   console.log(Math.trunc(s.random(0, 4)));
      // s.ellipse(newRect.x, newRect.y, ballSize, ballSize);
      // }
      s.windowResized = () => {
        s.resizeCanvas(this.windowWidth, this.windowHeight);
      }
    };
    // eslint-disable-next-line no-unused-vars
    const canvas = new P5(sketch, document.getElementById('canvasAnim') as HTMLElement);
  },
  destroyed() {
    let elements: any = document.getElementsByClassName('p5Canvas');
      console.log(elements);
      console.log(elements.length);
    for (let i = 0; i < elements.length; i++) {
      console.log(elements[i]);
      elements[i].remove();
    }
    console.log(elements);
  },
});
</script>

<style scoped lang="scss">

div {
  position: absolute;
  top: 0px;
}

</style>

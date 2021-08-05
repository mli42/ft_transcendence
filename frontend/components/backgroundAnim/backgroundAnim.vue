<template>
  <div class="canvas"></div>
</template>

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
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
      console.log(this.windowWidth);
      console.log(this.windowHeight);
    })
  },
  async mounted () {
    const { default: P5 } = await import('p5')

    const sketch = (s) => {
      s.setup = () => {
        s.createCanvas(window.innerWidth, window.innerHeight);
      }
      s.draw = () => {
        s.background(33, 33, 33);
        s.rectMode(s.CENTER);
        s.rect(s.mouseX, s.mouseY, 100, 100);
        s.rect(s.mouseX + 10, s.mouseY - 10, 100, 100);
        s.rect(s.mouseX - 10, s.mouseY + 10, 100, 100);
      }
      s.windowResized = () => {
        s.resizeCanvas(this.windowWidth, this.windowHeight);
      }
    };
    // eslint-disable-next-line no-unused-vars
    const canvas = new P5(sketch, 'canvas');
  },
  methods: {  
      onResize() {
          this.windowHeight = window.innerHeight;
          this.windowWidth = window.innerWidth;
      }
  }
});
</script>

<style scoped lang="scss">

.canvas {
  margin-top: 100px;
}

</style>

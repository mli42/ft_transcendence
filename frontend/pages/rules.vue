<template>
<div>
  <div id="rulesMain" class="useWholePage flexAlignCol">
    <h1>Game Rules</h1>
    <div id="rulesContent">
      <h2># The Game</h2>
      <p>
        This is a classic Pong game:
        If the ball hits the top, the bottom, or players' paddles, it bounces.
        If the ball reaches the right or the left edge, the opposite player scores a point.

        The game ends when a player has 7 (seven) points.
        The match becomes visible on each players' profiles and their elos are updated.
      </p>
      <br>
      <h2># Matchmaking</h2>
      <p>
        It is a system that matches users who wants to play at the same moment.
        The map is always the same as the good old pong.
        Power-ups are disabled.
      </p>
      <br>
      <h2># Private game</h2>
      <p>
        Private games are rooms where you can invite someone to play with you.
        Players can select power-ups, and choose the map.
      </p>
      <br>
      <h2># Power-ups</h2>
      <p>
        What we call <b>power-ups</b>, are temporary game changers.
        They are represented as small bubbles.
        They are bonuses (or penalties) for the last player that touched the ball.
        All power-ups modifications are reset when someone scores.

        There are 4 types of power-ups :

        - Ball size up: Increase the ball size by 75%.
        - Ball size down: Decrease the ball size by 75%.
        - Bar length up: Add 75% to the bar length.
        - Bar speed up: Add 75% to the bar speed.

        Power-ups can spawn randomly each time the ball hits a paddle.
        Power-ups are disabled in match-making games.
      </p>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'rules',
  head(): object {
    return {
      title: "Rules" as string,
    };
  },
});
</script>

<style scoped lang="scss" src="./rules.scss">
</style>

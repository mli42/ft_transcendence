<template>
  <div>
    <h1>Welcome to websocket POC</h1>
    <p>Enter text in this box and the text will be send in a websocket.</p>
    <p>The response must be the same as the input you send.</p>
    <form>
      <label for="text">Enter the text you want to send:</label>
      <br>
      <input v-model.lazy="inputText" @change="sendMessage" type="text" id="text">
      <p>This is the response:</p>
      <p class="txtBox">{{ response }}</p>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import io from 'socket.io-client'

export default Vue.extend({
  name: 'Play',
  layout: 'default',
  data() {
    return {
      title: 'Nestjs Websockets Chat',
      inputText: '',
      response: '(no response for now)',
      socket: {} as any,
    }
  },
  methods: {
    sendMessage() {
      this.socket.emit('msgToServer', this.inputText);
    },
  },
  mounted() {
    this.socket = io('ws://localhost:3000/');
    console.log(this.socket);
    this.socket.on("connect", () => {
      console.log('Connected to : ' + this.socket.id);
    });
    this.socket.on("disconnect", () => {
      console.log('Disconnected to : ' + this.socket.id);
    });
    this.socket.onAny((event: any, ...args: any[]) => {
      console.log(`New event : ${event}`);
    });
    this.socket.on("msgToClient", (data: any) => {
      console.log('msgToClient : ');
      console.log(data);
      this.response = data;
    });
  },
});
</script>

<style scoped lang="scss">

div {
  background-color: blue;
  color: white;
  position: relative;
  padding: 40px;
}

input, .txtBox {
  border: 2px solid red;
  border-radius: 3px;
  color: white;
}

</style>

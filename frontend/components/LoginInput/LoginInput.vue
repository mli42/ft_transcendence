<template>
  <div class="inputMain">
    <div class="label">
      <label :for="name">{{ name }}</label>
      <img v-if="isPassword" alt="eye icon to show/hide password"
      @click="hidePassword = !hidePassword"
      :src="`https://api.iconify.design/${eyeType}.svg?color=white`"
      />
    </div>
    <input :type="inputType" :id="name" :name="name"
    @input="updateValue($event.target.value)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LoginInput',
  data() {
    return {
      hidePassword: true as Boolean,
    };
  },
  methods: {
    updateValue: function (value: string) {
      this.$emit('input', value);
    },
  },
  computed: {
    inputType(): string {
      return (this.isPassword && this.hidePassword ? 'password' : 'text');
    },
    eyeType(): string {
      return (this.hidePassword ? 'ph:eye-closed-bold' : 'el:eye-open');
    },
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isPassword: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
});
</script>

<style scoped lang="scss" src="./LoginInput.scss">
</style>

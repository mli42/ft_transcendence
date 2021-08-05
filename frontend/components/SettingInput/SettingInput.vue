<template>
  <div class="inputMain">
    <div class="label">
      <label :for="id">{{ name }}</label>
      <img v-if="isPassword" alt="eye icon to show/hide password"
      @click="hidePassword = !hidePassword"
      :src="`https://api.iconify.design/${eyeType}.svg?color=white`"
      />
    </div>
    <div class="input">    
      <input :type="inputType" :id="id" :name="id" :placeholder="placeHolder"
      @input="updateValue($event.target.value)" />
      <img alt="check icon to validate input"
      :src="`https://api.iconify.design/ant-design:check-circle-filled.svg?color=white`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SettingInput',
  data(): any {
    return {
      id: `${this.name}` as String,
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
      return (this.hidePassword ? 'ph:eye-closed-bold' : 'ic:outline-remove-red-eye');
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
    placeHolder: {
      type: String,
      required: true,
    }
  },
});
</script>

<style scoped lang="scss" src="./SettingInput.scss">
</style>

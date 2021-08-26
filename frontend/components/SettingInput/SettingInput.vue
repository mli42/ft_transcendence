<template>
  <div class="inputMain">
    <div class="label">
      <label :for="id">{{ name }}</label>
      <Iconify v-if="isPassword" :iconName="this.eyeType"
      @click.native="hidePassword = !hidePassword"
      alt="eye icon to show/hide password"
      ></Iconify>
    </div>
    <div class="input">
      <input :type="inputType" :id="id" :name="id" :placeholder="placeHolder"
      @input="updateValue($event.target.value)" />
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
    },
    // changeFct: {
    //   type: Function,
    //   required: true,
    // }
  },
});
</script>

<style scoped lang="scss" src="./SettingInput.scss">
</style>

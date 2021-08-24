<template>
  <div class="inputMain">
    <div class="label">
      <label :for="id">{{ name }}</label>
      <div v-if="isPassword" @click="hidePassword = !hidePassword">
        <Iconify :iconName="this.eyeType"
        alt="eye icon to show/hide password"
        ></Iconify>
      </div>
    </div>
    <input :type="inputType" :id="id" :name="id"
    @input="updateValue($event.target.value)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LoginInput',
  data() {
    return {
      id: `${this.name}-${this.idNb}` as String,
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
    idNb: {
      type: Number,
      required: false,
      default: 0,
    },
  },
});
</script>

<style scoped lang="scss" src="./LoginInput.scss">
</style>

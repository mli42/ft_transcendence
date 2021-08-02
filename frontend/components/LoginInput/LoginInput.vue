<template>
  <div class="inputMain">
    <label :for="name">{{ name }}</label>
    <br>
    <input :type="inputType" :id="name" :name="name"
    @input="updateValue($event.target.value)"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LoginInput',
  data() {
    return {
    };
  },
  methods: {
    updateValue: function (value: string) {
      this.$emit('input', value);
    },
  },
  computed: {
    inputType(): string {
      return (this.isPassword ? 'password' : 'text');
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

<template>
  <div>
    <NavBar></NavBar>
    <Nuxt class="NavBarShift" />
  </div>
</template>

<style scoped lang="scss">
.NavBarShift {
  position: fixed;
  top: 64px;
  height: 100%;
  width: 100%;
}
</style>

<template>
  <div>
    <NavBar></NavBar>
    <Nuxt class="NavBarShift" />
  </div>
</template>

<style scoped lang="scss">
.NavBarShift {
  position: absolute;
  top: 64px;
}
</style>

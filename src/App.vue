<template>
  <v-app>
    <nav>
      <router-link to="/">Chip8</router-link> |
      <router-link to="/about">About Chip8</router-link>
    </nav>
    <router-view />
    <v-footer style="background-color: black; color: #42b983" class="v-footer d-flex flex-column">
      &copy; {{ new Date().getFullYear() }} Michał Kowalik</v-footer>
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

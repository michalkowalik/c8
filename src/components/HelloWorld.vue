<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3> For a CHIP-8 related information check the following</h3>
    <ul>
      <li><a href="https://callistaenterprise.se/blogg/teknik/2023/01/01/chip8-with-rust-and-go/" target="_blank"
          rel="noopener">CHIP-8 in Rust and Go</a></li>
      <li><a href="https://tobiasvl.github.io/blog/write-a-chip-8-emulator/" target="_blank" rel="noopener">Chip
          Emulator</a></li>
      <li><a href="https://chip-8.github.io/links/" target="_blank" rel="noopener">Awesome CHIP-8</a></li>
      <li><a href="http://devernay.free.fr/hacks/chip8/C8TECH10.HTM" target="_blank" rel="noopener">C-8 Technical
          reference</a></li>
      <li><a href="https://multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/" target="_blank"
          rel="noopener">Write a C-8 emulator</a></li>
      <li><a href="https://github.com/loktar00/chip8/tree/master/roms">Collection of ROMs</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a>
      </li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    msg: String
  }
})
export default class HelloWorld extends Vue {
  msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}</style>

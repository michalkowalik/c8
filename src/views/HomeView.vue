<template>
  <div class="home">
    <HelloWorld msg="Vue.js + TypeScript CHIP-8 interpreter" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Options({
  components: {
    HelloWorld,
  },
})
export default class HomeView extends Vue { }
</script>
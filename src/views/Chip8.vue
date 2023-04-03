<template>
  <div class="chip8">
    <Chip8/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Chip8 from '@/components/Chip8.vue'; // @ is an alias to /src

@Options({
  components: {
    Chip8,
  },
})
export default class ChipView extends Vue {}
</script>

<template>
    <div class="chip-8">
        <h1>CHIP-8</h1>
        <p>Here goes nothing (so far)</p>
        <canvas ref="chipCanvas" width="512" height="256" style="border:1px solid #000000;">
                </canvas> 
    </div>
</template>

<script lang="ts">
    import { Emulator } from '@/chip8/Emulator';
    import { defineComponent } from 'vue';

    export default defineComponent({
        // eslint-disable-next-line vue/multi-word-component-names
        name: 'Chip8',
        props: {
            
        },
        mounted() {
            const chipCanvas = this.$refs.chipCanvas as HTMLCanvasElement;
            let emulator = new Emulator(chipCanvas);
            emulator.init();
            emulator.run();
        }   
    });
</script>
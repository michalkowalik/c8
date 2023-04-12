<template>
    <div class="chip-8">
        <h1>CHIP-8</h1>
        <p>Here goes nothing</p>
        <canvas ref="chipCanvas" width="512" height="256" style="border:1px solid #000000;">
                </canvas> 
    </div>
    <div>
        <button @click="step">Step</button>
        <button @click="run">Run</button>
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
        data() {
            return {
                emulator: null as Emulator | null,
            }
        },
        mounted() {
            const chipCanvas = this.$refs.chipCanvas as HTMLCanvasElement;
            this.emulator = new Emulator(chipCanvas);
            this.emulator.init();
            //this.emulator.run();
        },
        methods: {
            run() {
                console.log("Starting emulator");
                if(this.emulator) {
                    this.emulator.run();
                }
            },
            step() {
                console.log("Stepping emulator");
                if (this.emulator) {
                    this.emulator.step();
                }
            },
        }
    });
</script>
<template>
    <v-container>
        <v-row justify="center">
            <div class="chip-8">
                <h1>CHIP-8</h1>
                <p>Here goes nothing</p>
            </div>
        </v-row>
        <v-spacer><br></v-spacer>
        <v-row justify="center">
            <v-col>
                <v-card class="mx-auto">
                    <v-card-item>
                        <canvas ref="chipCanvas" width="512" height="256" style="border:1px solid #000000;">
                        </canvas>
                    </v-card-item>
                </v-card>
            </v-col>
            <v-col>
                <v-card title="CPU STATUS" class="mx-auto">
                    <v-card-item>
                        <div>
                            <v-row>
                                <v-col>
                                    <v-btn color="primary" variant="outlined" @click="step">Step</v-btn>
                                </v-col>
                                <v-col>
                                    <v-btn color="success" v-bind:variant="cpuState === 'run' ? 'elevated' : 'outlined'"
                                        @click="run">Run</v-btn>
                                </v-col>
                                <v-col>
                                    <v-btn color="error" v-bind:variant="cpuState === 'halt' ? 'elevated' : 'outlined'"
                                        @click="halt">Halt</v-btn>
                                </v-col>
                                <v-col>
                                    <v-btn color="purple-darken-2" variant="outlined" @click="reset"> Reset</v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-item>
                </v-card>
                <br>
                <v-card title="Load ROM from file" class="mx-auto">
                    <v-card-item>
                        <v-file-input label="ROM File" @change="uploadFile"></v-file-input>
                    </v-card-item>
                </v-card>
                <br>
                <v-card title="Set Memory" class="mx-auto">
                    <v-card-item>
                        <v-text-field label="Address"></v-text-field>
                        <v-text-field label="Value"></v-text-field>
                        <v-btn color="primary">Set</v-btn>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <v-spacer><br></v-spacer>

        <v-row>
            <v-card title="Register status" class="mx-auto">

            </v-card>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Emulator } from '@/chip8/Emulator';
import { defineComponent, } from 'vue';


export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Chip8',

    computed: {
    },
    data() {
        return {
            emulator: null as Emulator | null,
            cpuState: 'halt' as string
        };
    },
    mounted() {
        const chipCanvas = this.$refs.chipCanvas as HTMLCanvasElement;
        this.emulator = new Emulator(chipCanvas);
        this.emulator.init();
    },
    methods: {
        run() {
            console.log("Starting emulator");
            if (this.emulator) {
                this.emulator.start();
                this.emulator.run();
                this.cpuState = 'run';
            }
        },
        halt() {
            console.log("Halting CPU");
            if (this.emulator) {
                this.emulator.halt();
                this.cpuState = 'halt';
            }
        },
        step() {
            console.log("Stepping emulator");
            if (this.emulator) {
                this.emulator.step();
                this.cpuState = 'halt';
            }
        },
        reset() {
            console.log("Reseting emulator");
            if (this.emulator) {
                this.emulator.halt();
                this.emulator.init();
                this.cpuState = 'halt';
            }
        },
        uploadFile(e: { target: { files: FileList; }; }) {

            const reader = new FileReader();
            reader.readAsArrayBuffer(e.target.files[0]);
            reader.onloadend = () => {
                if (this.emulator) {
                    this.emulator.loadRom(new Int8Array(reader.result as ArrayBuffer));
                }
            };
        }
    }
});
</script>
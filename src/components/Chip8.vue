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
                <br>
                <RegisterStatus :status="cpuStatus" v-on:regStatusChange="handleRegStatusChange" />
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
                <v-expansion-panels variant="inset">
                    <v-expansion-panel>
                        <v-expansion-panel-title>
                            <v-row no-gutters>
                                Set Memory
                            </v-row>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-card class="mx-auto">
                                <v-card-item>
                                    <v-form fast-fail @submit.prevent v-model="isFormValid">
                                        <v-text-field v-model="setMemoryAddress" label="Address"
                                            :rules="addressRules"></v-text-field>
                                        <v-text-field v-model="setMemoryValue" label="Value"
                                            :rules="valueRules"></v-text-field>
                                        <v-btn color="primary" @click="setMemory" :disabled="!isFormValid">Set</v-btn>
                                    </v-form>
                                </v-card-item>
                            </v-card>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>

        <v-spacer><br></v-spacer>
    </v-container>
</template>

<script lang="ts">
import { Emulator } from '@/chip8/Emulator';
import { CpuStatus } from '@/types';
import { defineComponent, } from 'vue';
import RegisterStatus from './RegisterStatus.vue';

export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Chip8',

    components: {
        RegisterStatus
    },
    computed: {
    },
    data() {
        return {
            emulator: null as Emulator | null,
            cpuState: 'halt' as string,
            cpuStatus: {} as CpuStatus,
            setMemoryAddress: '' as string,
            setMemoryValue: '' as string,
            isFormValid: true as boolean,
            addressRules: [
                (value: string) => {
                    if (typeof (parseInt(value)) === 'number') {
                        if (parseInt(value) >= 0 && parseInt(value) <= 0xFFF) {
                            return true;
                        }
                    }
                    return 'Address must be an integer value between 0x0 and 0xFFF';
                },
            ],
            valueRules: [
                (value: string) => {
                    if (typeof (parseInt(value)) === 'number') {
                        if (parseInt(value) >= 0 && parseInt(value) <= 0xFF) {
                            return true;
                        }
                    }
                    return 'Value must be an integer value between 0x0 and 0xFF';
                },

            ]
        };
    },
    mounted() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        const chipCanvas = this.$refs.chipCanvas as HTMLCanvasElement;
        this.emulator = new Emulator(chipCanvas);
        this.emulator.init();
        this.cpuStatus = new CpuStatus([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0]);
    },
    beforeUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
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
        },
        handleKeyDown(event: KeyboardEvent) {
            this.emulator?.setKeyState(event.key, true);
        },
        handleKeyUp(event: KeyboardEvent) {
            this.emulator?.setKeyState(event.key, false);
        },
        handleRegStatusChange(s: boolean) {
            console.log("event received");
            if (this.emulator) {
                if (!s) {
                    this.cpuStatus = this.emulator.getCpuStatus();
                } else {
                    this.cpuStatus = new CpuStatus([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0]);
                }
            }
        },
        setMemory() {
            if (this.emulator) {
                this.emulator.setMemoryByte(parseInt(this.setMemoryAddress), parseInt(this.setMemoryValue));
            }
        },
    }
});
</script>
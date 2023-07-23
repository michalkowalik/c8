<template>
    <v-expansion-panels variant="inset">
        <v-expansion-panel>
            <v-expansion-panel-title>
                <v-row no-gutters>
                    Register Status
                </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-card class="mx-auto">
                    <v-card-item>
                        <v-switch v-model="switchStatus" hide-details inset :label="switchStatus ? 'On' : 'Off'"
                            :color="switchStatus ? 'success' : 'primary'"
                            v-on:click="() => this.$emit('regStatusChange', switchStatus)"></v-switch>
                    </v-card-item>
                    <v-card-item>
                        <v-table>
                            <thead>
                                <th>V0</th>
                                <th>V1</th>
                                <th>V2</th>
                                <th>V3</th>
                                <th>V4</th>
                                <th>V5</th>
                                <th>V6</th>
                                <th>V7</th>
                            </thead>
                            <tbody>
                                <td>{{ printRegisterValue(0) }}</td>
                                <td>{{ printRegisterValue(1) }}</td>
                                <td>{{ printRegisterValue(2) }}</td>
                                <td>{{ printRegisterValue(3) }}</td>
                                <td>{{ printRegisterValue(4) }}</td>
                                <td>{{ printRegisterValue(5) }}</td>
                                <td>{{ printRegisterValue(6) }}</td>
                                <td>{{ printRegisterValue(7) }}</td>
                            </tbody>
                        </v-table>
                        <br>
                        <v-table>
                            <thead>
                                <th>V8</th>
                                <th>V9</th>
                                <th>VA</th>
                                <th>VB</th>
                                <th>VC</th>
                                <th>VD</th>
                                <th>VE</th>
                                <th>VF</th>
                            </thead>
                            <tbody>
                                <td>{{ printRegisterValue(8) }}</td>
                                <td>{{ printRegisterValue(9) }}</td>
                                <td>{{ printRegisterValue(10) }}</td>
                                <td>{{ printRegisterValue(11) }}</td>
                                <td>{{ printRegisterValue(12) }}</td>
                                <td>{{ printRegisterValue(13) }}</td>
                                <td>{{ printRegisterValue(14) }}</td>
                                <td>{{ printRegisterValue(15) }}</td>
                            </tbody>
                        </v-table>
                        <br>
                        <v-table>
                            <thead>
                                <th>I</th>
                                <th>PC</th>
                            </thead>
                            <tbody>
                                <td>{{ "0x" + status.indexRegisters[0].toString(16).padStart(3, '0') }}</td>
                                <td>{{ "0x" + status.indexRegisters[1].toString(16).padStart(3, '0') }}</td>
                            </tbody>
                        </v-table>
                    </v-card-item>
                </v-card>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { CpuStatus } from '@/types';

export default defineComponent({
    name: 'RegisterStatus',
    data() {
        return {
            switchStatus: false
        };
    },
    props: {
        status: {
            type: Object as PropType<CpuStatus>,
            required: true
        },
    },
    methods: {
        printRegisterValue(reg: number): string {
            return "0x" + this.status.registers[reg].toString(16).padStart(2, '0');
        }
    }
});

</script>
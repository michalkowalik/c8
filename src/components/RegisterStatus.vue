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
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
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
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                            </tbody>
                        </v-table>
                        <br>
                        <v-table>
                            <thead>
                                <th>I</th>
                                <th>PC</th>
                            </thead>
                            <tbody>
                                <td>--</td>
                                <td>--</td>
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


export default defineComponent({
    name: 'RegisterStatus',

});

</script>
// CHIP-8 emulator class

import { Cpu } from "./Cpu";
import { Display } from "./Display";

export class Emulator {
    private canvas: HTMLCanvasElement;
    private display: Display;
    private cpu: Cpu;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.display = new Display(canvas);
        this.cpu = new Cpu();
    }

    public init(): void {
        // clear the screen
        this.display.clear();

        // load fonts,

    }

    public run(): void {
        // here goes nothing
    }

}
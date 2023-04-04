// CHIP-8 emulator class

import { Cpu } from "./Cpu";
import { Display } from "./Display";
import { c8Fonts } from "./fonts";

export class Emulator {
    private canvas: HTMLCanvasElement;
    private display: Display;
    private cpu: Cpu;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.display = new Display(canvas);
        this.cpu = new Cpu(this.display);
    }

    public init(): void {
        // clear the screen
        this.display.clear();

        // load fonts - for whatever historical reason, there's a convention
        // to load fonts to addresses between 050 - 09F
        let addrPointer = 0x50;
        for (const font in c8Fonts) {
            for (const v of c8Fonts[font]) {
                this.cpu.memory[addrPointer] = v;
                addrPointer+=1;
            }
        }

    }

    public run(): void {
        // here goes nothing
    }

}
// CHIP-8 emulator class

import { Cpu } from "./Cpu";
import { Display } from "./Display";
import { c8Fonts } from "./fonts";
import { IbmRom } from "./ibm";

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

        // load ibm logo to memory
        this.loadIBM();

    }

    public async run(): Promise<void> {
        for (;;) {
            await this.cpu.step();
            await this.display.render();
        }
    }

    public async step(): Promise<void> {
        await this.cpu.step();
        await this.display.render();
    }

    private loadIBM(): void {
        // starting address of the 
        let addr = 0x200;
        for (const i of IbmRom) {
            this.cpu.memory[addr] = i;
            addr += 1;
        }
    }

}
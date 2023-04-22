// CHIP-8 emulator class

import { Cpu } from "./Cpu";
import { Display } from "./Display";
import { c8Fonts } from "./fonts";
import { IbmRom } from "./ibm";

export class Emulator {
  private loadIBMRom = false;

  // CPU tick interval => hopefully a temporary solution
  private deltaTime = 1;

  private display: Display;
  private cpu: Cpu;
  private interval: ReturnType<typeof setInterval>;
  private running: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.display = new Display(canvas);
    this.cpu = new Cpu(this.display);
    this.interval = 0;
    this.running = false;
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
        addrPointer += 1;
      }
    }

    // load ibm logo to memory
    if (this.loadIBMRom) {
      this.loadIBM();
    }
  }

  public async run(): Promise<void> {
    if (this.running) {
      if (!this.interval || this.interval == 0) {
        this.interval = setInterval(() => {
          this.step();
        }, this.deltaTime);
      }
    }
  }

  public start(): void {
    this.cpu.startTimers();
    this.running = true;
  }

  public halt(): void {
    this.running = false;
    this.cpu.stopTimers();
    clearInterval(this.interval);
    this.interval = 0;
  }

  public async step(): Promise<void> {
    await this.cpu.step();
    if (this.cpu.isRedrawNeeded()) {
      await this.display.render();
      this.cpu.unsetRedrawNeeded();
    }
  }

  public async loadRom(data: Int8Array): Promise<void> {
    console.log("loading rom...");
    let addr = 0x200;
    for (const i of data) {
      this.cpu.memory[addr] = i;
      addr += 1;
    }
  }

  private loadIBM(): void {
    // starting address of the program 
    let addr = 0x200;
    for (const i of IbmRom) {
      this.cpu.memory[addr] = i;
      addr += 1;
    }
  }
}

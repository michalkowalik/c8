// CHIP-8 emulator class

import { Cpu } from "./Cpu";
import { Display } from "./Display";
import { c8Fonts } from "./fonts";
import { OpcodeTest } from "./optest2";
import { Keyboard } from "./Keyboard";
import { CpuStatus } from "@/types";

export class Emulator {
  private loadOpcodeTest = false;

  // CPU tick interval => hopefully a temporary solution
  private deltaTime = 1;
  private display: Display;
  private cpu: Cpu;
  private interval: ReturnType<typeof setInterval>;
  private running: boolean;
  private keyboard: Keyboard = new Keyboard();
  private indexRegisters: number[] = new Array(2);

  constructor(canvas: HTMLCanvasElement) {
    this.display = new Display(canvas);
    this.cpu = new Cpu(this.display);
    this.interval = 0;
    this.running = false;
  }

  public init(): void {
    this.cpu.init();
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

    this.indexRegisters[0] = this.cpu.I;
    this.indexRegisters[1] = this.cpu.pc;

    // load ibm logo to memory
    if (this.loadOpcodeTest) {
      this.loadTest();
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
    this.indexRegisters[0] = this.cpu.I;
    this.indexRegisters[1] = this.cpu.pc;
  }

  public async loadRom(data: Int8Array): Promise<void> {
    console.log("loading rom...");
    let addr = 0x200;
    for (const i of data) {
      this.cpu.memory[addr] = i;
      addr += 1;
    }
    this.display.clear();
  }

  public async setKeyState(key: string, state: boolean): Promise<void> {
    const keyValue = this.keyboard.getKeyCodeForKey(key);
    if (keyValue !== undefined) {
      this.cpu.setKeyState(state);
      if (state) {
        this.cpu.setPressedKey(keyValue);
      } else {
        this.cpu.setPressedKey(0);
      }
    }
  }

  public getCpuStatus(): CpuStatus {
    return new CpuStatus(this.cpu.V, this.indexRegisters);
  }

  public setMemoryByte(address: number, value: number): void {
    if (address < 0 || address > 0xFFF) {
      throw new Error('Illegal address');
    }
    if (value < 0 || value > 0xFF) {
      throw new Error('Value does not fit single byte');
    }

    this.cpu.memory[address] = value;
  }

  private loadTest(): void {
    // starting address of the program 
    console.log("loading opcode test..");
    let addr = 0x200;
    for (const i of OpcodeTest) {
      this.cpu.memory[addr] = (i & 0xFF00) >> 8;
      this.cpu.memory[addr + 1] = i & 0xFF;
      addr += 2;
    }
  }
}

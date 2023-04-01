/* eslint-disable @typescript-eslint/no-inferrable-types */
// CHIP=8 CPU class

export type opCode = number;

export class Cpu {
    // index register
    I: number = 0;

    // program counter:
    pc: number = 0;

    // 16 registers
    V: number[] = new Array(16);

    // 4k of memory
    // we're using only the lowest 8 bits of every number.
    memory: number[] = new Array(4096);

    // timers
    delayTimer: number = 0;
    soundTimer: number = 0;

    // stack and stack pointer
    stack: number[] = new Array(16);
    sp: number = 0;

    //constructor might be a bit unnecessary, but let's see:
    constructor() {
        this.V.fill(0);
        this.memory.fill(0);
    }

    // single CPU step
    public step(): void {
        const opcode: opCode = this.memory[this.pc] << 8 | this.memory[this.pc + 1] & 0xFF;
        console.log(opcode);
        
        // decode instruction

        // execute instruction
    }
}

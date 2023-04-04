/* eslint-disable @typescript-eslint/no-inferrable-types */
// CHIP=8 CPU class

import { Display } from "./Display";

export type opCode = number;

export type OpCodes = {
    [code: opCode]: (code: opCode) => void;
}

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

    private display: Display;

    // keeping opcodes in a lookup table simplifies decoding
    private codes: OpCodes = {
        0x00E0 : this.opClearScreen,
        0x1000 : this.opJump,
        0x6000 : this.opSet
    }

    constructor(display: Display) {
        this.V.fill(0);
        this.memory.fill(0);
        this.pc = 0x200;
        this.display = display;
    }

    // single CPU step
    public step(): void {
        const opcode: opCode = this.memory[this.pc] << 8 | this.memory[this.pc + 1] & 0xFF;
        console.log(opcode);
        
        // decode instruction

        // execute instruction
    }

    // let's define some opcodes:

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private opClearScreen(_code: opCode) {
        this.display.clear();
    }

    // NO PC INCREMENT AFTER JUMP!
    private opJump(code: opCode) {
        const addr = code & 0xFFF
        this.pc = addr;
    }

    private opSet(code: opCode) {
        const register = (code & 0xF00) >> 8;
        const value = code & 0xFF;
        this.V[register] = value;
    }
}

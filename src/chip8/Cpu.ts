/* eslint-disable @typescript-eslint/no-inferrable-types */
// CHIP=8 CPU class

import { Display } from "./Display";
import { Stack } from "./Stack";

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
    private stack = new Stack<number>(16);

    private display: Display;

    // keeping opcodes in a lookup table simplifies decoding
    private codes: OpCodes = {
        0x00E0 : this.opClearScreen,
        0x1000 : this.opJump,
        0x6000 : this.opSet,
        0x7000 : this.opAdd,
        0xA000 : this.opSetIndexReg,
        0xD000 : this.opDraw,
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

        // increase PC -> unless the operation was jump (?)
    }

    // let's define some opcodes:

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private opClearScreen(_code: opCode) {
        this.display.clear();
    }

    // NO PC INCREMENT AFTER JUMP!
    private opJump(code: opCode) {
        const addr = code & 0xFFF;
        this.pc = addr;
    }

    private opSet(code: opCode) {
        const register = (code & 0xF00) >> 8;
        const value = code & 0xFF;
        this.V[register] = value;
    }

    // Add NN to VX.
    // CHIP-8 does not set the carry flag
    private opAdd(code: opCode) {
        const reg = (code & 0x0F00) >> 8;
        const val = (code & 0xFF);

        this.V[reg] = (this.V[reg] + val) & 0xFF;
    }

    private opSetIndexReg(code: opCode) {
        this.I = code & 0x0FFF;        
    }

    /*
     * DXYN:
     * This is the most involved instruction. 
     * It will draw an N pixels tall sprite from the memory location that the I index register is holding to the screen,
     * at the horizontal X coordinate in VX and the Y coordinate in VY.
     * 
     * one byte contains a row of 8 pixels -> each bit is a pixel, left to right from msb to lsb
     * 
     * All the pixels that are “on” in the sprite will flip the pixels on the screen that it is drawn to 
     * (from left to right, from most to least significant bit). If any pixels on the screen were turned “off” by this,
     * the VF flag register is set to 1. Otherwise, it’s set to 0.
     */
    private opDraw(code: opCode)  {
        const x = (this.V[code & 0x0F00 >> 8]) % 64; // modulo screen width
        let y = (this.V[code & 0x00F0 >> 4]) % 32; // modulo screen height
        const rowCount = code & 0xF;

        this.V[0xF] = 0;
        for (let row = 0; row++; row < rowCount) {
            let currentX = x;
            const line = this.memory[this.I + row]

            for (let i = 0; i++; i < 8) {
                const pixel = (line & (1 << (7 - i))) >> (7 - i);

                // collision detection
                if (pixel === 1 && this.display.getPixel(currentX, y) === 1) {
                    this.V[0xF] = 1;
                }

                this.display.setPixel(currentX, y, pixel);
                currentX += 1;
            }
            y += 1;
        }

        // TOOD: redraw can be triggered by a counter running in the background.
        // screen modified, redraw:
        this.display.render();

    }
}
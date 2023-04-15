/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
// CHIP=8 CPU class

import { Display } from "./Display";
import { Stack } from "./Stack";

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

    // is redraw needed?
    redrawNeeded: boolean = false;

    // stack and stack pointer
    private stack = new Stack<number>(16);

    private display: Display;

    constructor(display: Display) {
        this.V.fill(0);
        this.memory.fill(0);
        this.pc = 0x200;
        this.display = display;
    }

    // single CPU step
    public async step(): Promise<void> {
        const opcode: opCode = this.memory[this.pc] << 8 | this.memory[this.pc + 1] & 0xFF;
        console.log(opcode.toString(16));
        
        // decode & execute instruction
        switch (opcode & 0xF000) {
            case 0x0000: {
                if (opcode == 0x00E0) {
                    this.opClearScreen(opcode);
                }
                if (opcode == 0x00EE) {
                    this.opRet(opcode);
                }
            }
                break;
            case 0x1000: this.opJump(opcode);
                break; 
            case 0x2000: this.opCall(opcode);
                break;
            case 0x3000: this.opSkipEqual(opcode);
                break;
            case 0x4000: this.opSkipNotEqual(opcode);
                break;
            case 0x5000: this.opSkipRegEqual(opcode);
                break;
            case 0x6000: this.opSet(opcode);
                break;
            case 0x7000: this.opAdd(opcode);
                break;
            case 0x8000: {
                switch (opcode & 0xF) {
                    case 0x1: this.opLD(opcode);
                        break;
                    case 0x2: this.opAND(opcode);
                        break;
                    case 0x3: this.opXOR(opcode);
                        break;
                    case 0x4: this.opADD(opcode);
                        break;
                    case 0x5: this.opSUB(opcode);
                        break;
                    case 0x6: this.opSHR(opcode);
                        break;
                    case 0x7: this.opSUBN(opcode);
                        break;
                    case 0xE: this.opSHL(opcode);
                        break;
                    default:
                        throw new Error('No opcode found');
                }
            }
                break;
            case 0xA000: this.opSetIndexReg(opcode);
                break;
            case 0xD000: this.opDraw(opcode);
                break;
            default:
                throw new Error("No OpCode found");
        }

        // increase PC -> unless the operation was jump (?)
        if ((opcode & 0xF000) != 0x1000) {
            this.pc += 2;
        }
    }

    public isRedrawNeeded() : boolean  {
        return this.redrawNeeded;
    }

    public unsetRedrawNeeded() : void {
        this.redrawNeeded = false;
    }

    /*
     00E0 - CLS
     Clear the display.
    */
    private opClearScreen(_code: opCode) {
        this.display.clear();
    }

    /*
     00EE - RET
     Return from a subroutine.
    */
    private opRet(_code: opCode) {
        this.pc = this.stack.pop();
    }

    /*
     1nnn - JP addr
     Jump to location nnn. NO PC INCREMENT AFTER JUMP!
    */
    private opJump(code: opCode) {
        const addr = code & 0xFFF;
        this.pc = addr;
    }

    /*
     2nnn - CALL addr
     Call subroutine at nnn.
    */ 
    private opCall(code: opCode) {
        const addr = code & 0xFFF;
        this.stack.push(this.pc);
        this.pc = addr;
    }

    /*
     3xkk - SE Vx, byte
     Skip next instruction if Vx = kk.    
    */
   private opSkipEqual(code: opCode) {
        const register = (code & 0x0F00) >> 8;
        const val = code & 0xFF;
        if (this.V[register] === val) {
            this.pc += 2;
        }
   }

   /*
    4xkk - SNE Vx, byte
    Skip next instruction if Vx != kk.
   */
   private opSkipNotEqual(code: opCode) {
        const register = (code & 0x0F00) >> 8;
        const val = code & 0xFF;
        if (this.V[register] !== val) {
            this.pc += 2;
        }
   }

   /*
    5xy0 - SE Vx, Vy
    Skip next instruction if Vx = Vy.
   */
   private opSkipRegEqual(code: opCode) {
        const regX = (code & 0x0F00) >> 8;
        const regY = (code & 0x00F0) >> 4;
        if (this.V[regX] == this.V[regY]) {
            this.pc += 2;
        }
   }

   /*
    6xkk - LD Vx, byte
    Set Vx = kk.
   */
    private opSet(code: opCode) {
        const register = (code & 0xF00) >> 8;
        const value = code & 0xFF;
        this.V[register] = value;
    }

    /*
     7xkk - ADD Vx, byte
     Set Vx = Vx + kk.
    */
    private opAdd(code: opCode) {
        const reg = (code & 0x0F00) >> 8;
        const val = (code & 0xFF);

        this.V[reg] = (this.V[reg] + val) & 0xFF;
    }

    private registerOp(code: opCode, f: (regX: number, regY: number) => number) : void {
        const regX = (code & 0x0F00) >> 8;
        const regY = (code & 0x00F0) >> 4;
        this.V[regX] = f(this.V[regX], this.V[regY])
    }

    /*
     8xy0 - LD Vx, Vy
     Set Vx = Vy.
     Stores the value of register Vy in register Vx.
    */
    private opLD(code: opCode) {
        this.registerOp(code, (_x, y) => y);
    }

    /*
     8xy1 - OR Vx, Vy
     Set Vx = Vx OR Vy.
    */
    private opOR(code: opCode) {
        this.registerOp(code, (x, y) => x | y);
    }

    /*
     8xy2 - AND Vx, Vy
     Set Vx = Vx AND Vy.
    */
    private opAND(code: opCode) {
        this.registerOp(code, (x, y) => x & y);
    }

    /*
     8xy3 - XOR Vx, Vy
     Set Vx = Vx XOR Vy.
    */
    private opXOR(code: opCode) {
        this.registerOp(code, (x, y) => x ^ y);
    }

    /*
     8xy4 - ADD Vx, Vy
     Set Vx = Vx + Vy, set VF = carry.
    */
    private opADD(code: opCode) {
        this.registerOp(code, (x, y) => {
            (x + y > 255) ? this.V[0xF] = 1 : this.V[0xF] = 0;
            return (x + y) & 0xFF;
            });
    }

    /*
     8xy5 - SUB Vx, Vy  
     Set Vx = Vx - Vy, set VF = NOT borrow.
    */
    private opSUB(code: opCode) {
        this.registerOp(code, (x, y) => {
            (x > y) ? this.V[0xF] = 1 : this.V[0xF] = 0;
            return x - y;
        });
    }

    /*
     8xy6 - SHR Vx {, Vy}
     Set Vx = Vx SHR 1.
    */
    private opSHR(code: opCode) {
        this.registerOp(code, (x, _y) => {
            ((x & 1) == 1) ? this.V[0xF] = 1 : this.V[0xF] = 0;
            return x >> 1;
        });
    }

    /*
     8xy7 - SUBN Vx, Vy
     Set Vx = Vy - Vx, set VF = NOT borrow.
    */
    private opSUBN(code: opCode) {
        this.registerOp(code, (x, y) => {
            (y > x) ? this.V[0xF] = 1 : this.V[0xF] = 0;
            return y - x;
        });
    }

    /*
     8xyE - SHL Vx {, Vy}
     Set Vx = Vx SHL 1.
    */
    private opSHL(code: opCode) {
        this.registerOp(code, (x, _y) => {
            ((x & 0x80) == 0x80) ? this.V[0xF] = 1 : this.V[0xF] = 0;
            return (x << 1) & 0xFF;
        });
    }

    /*
     Annn - LD I, addr
     Set I = nnn.
    */
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
        const x = (this.V[(code & 0x0F00) >> 8]) % 64; // modulo screen width
        let y = (this.V[(code & 0x00F0) >> 4]) % 32; // modulo screen height
        const rowCount = code & 0xF;

        this.V[0xF] = 0;
        for (let row = 0; row < rowCount; row++) {
            let currentX = x;
            const line = this.memory[this.I + row]

            for (let i = 0; i < 8; i++) {
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

        this.redrawNeeded = true;

        // TOOD: redraw can be triggered by a counter running in the background.
        // screen modified, redraw:
        // this.display.render();

    }
}

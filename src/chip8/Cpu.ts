/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
// CHIP=8 CPU class

import { Display } from "./Display";
import { Stack } from "./Stack";
import { Timer } from "./Timer";

export type opCode = number;

export class Cpu {
  consoleDebug: boolean = false;

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
  delayTimer: Timer = new Timer();
  soundTimer: Timer = new Timer();

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
    this.delayTimer.start;
    this.soundTimer.start;
  }

  // single CPU step
  public async step(): Promise<void> {
    const opcode: opCode =
      (this.memory[this.pc] << 8) | (this.memory[this.pc + 1] & 0xff);
    if (this.consoleDebug) {
      console.log(opcode.toString(16));
    }

    // decode & execute instruction
    switch (opcode & 0xf000) {
      case 0x0000:
        {
          if (opcode == 0x00e0) {
            this.opClearScreen(opcode);
          }
          if (opcode == 0x00ee) {
            this.opRet(opcode);
          }
        }
        break;
      case 0x1000:
        this.opJump(opcode);
        break;
      case 0x2000:
        this.opCall(opcode);
        break;
      case 0x3000:
        this.opSkipEqual(opcode);
        break;
      case 0x4000:
        this.opSkipNotEqual(opcode);
        break;
      case 0x5000:
        this.opSkipRegEqual(opcode);
        break;
      case 0x6000:
        this.opSet(opcode);
        break;
      case 0x7000:
        this.opAdd(opcode);
        break;
      case 0x8000:
        {
          switch (opcode & 0xf) {
            case 0x0:
              this.opLD(opcode);
              break;
            case 0x1:
              this.opOR(opcode);
              break;
            case 0x2:
              this.opAND(opcode);
              break;
            case 0x3:
              this.opXOR(opcode);
              break;
            case 0x4:
              this.opADD(opcode);
              break;
            case 0x5:
              this.opSUB(opcode);
              break;
            case 0x6:
              this.opSHR(opcode);
              break;
            case 0x7:
              this.opSUBN(opcode);
              break;
            case 0xe:
              this.opSHL(opcode);
              break;
            default:
              throw new Error("No opcode found");
          }
        }
        break;
      case 0x9000:
        this.opSNE(opcode);
        break;
      case 0xa000:
        this.opSetIndexReg(opcode);
        break;
      case 0xb000:
        this.opJP(opcode);
        break;
      case 0xc000:
        this.opRND(opcode);
        break;
      case 0xd000:
        this.opDraw(opcode);
        break;
      case 0xe000:
        {
          switch (opcode & 0xff) {
            case 0x9e:
              this.opSKP(opcode);
              break;
            case 0xa1:
              this.opSKNP(opcode);
              break;
          }
        }
        break;
      case 0xf000:
        {
          switch (opcode & 0xff) {
            case 0x07:
              this.opLdDelayTimer(opcode);
              break;
            case 0x0a:
              this.opWaitForKey(opcode);
              break;
            case 0x15:
              this.opSetDelayTimer(opcode);
              break;
            case 0x18:
              this.opSetSoundTimer(opcode);
              break;
            case 0x1e:
              this.opSetIndex(opcode);
              break;
            case 0x29:
              this.opLoadChar(opcode);
              break;
            case 0x33:
              this.opLDBCD(opcode);
              break;
            case 0x55:
              this.opStoreRegisters(opcode);
              break;
            case 0x65:
              this.opLoadRegisters(opcode);
              break;
          }
        }
        break;
      default:
        throw new Error("No OpCode found");
    }

    // increase PC -> unless the operation was jump (?)
    if ((opcode & 0xf000) != 0x1000 && (opcode & 0xf000) != 0xb000) {
      this.pc += 2;
    }
  }

  public isRedrawNeeded(): boolean {
    return this.redrawNeeded;
  }

  public unsetRedrawNeeded(): void {
    this.redrawNeeded = false;
  }

  public stopTimers(): void {
    this.delayTimer.stop();
    this.soundTimer.stop();
  }

  public startTimers(): void {
    this.delayTimer.start();
    this.soundTimer.start();
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
    const addr = code & 0xfff;
    this.pc = addr;
  }

  /*
     2nnn - CALL addr
     Call subroutine at nnn.
    */
  private opCall(code: opCode) {
    const addr = code & 0xfff;
    this.stack.push(this.pc);
    this.pc = addr;
  }

  /*
     3xkk - SE Vx, byte
     Skip next instruction if Vx = kk.    
    */
  private opSkipEqual(code: opCode) {
    const register = (code & 0x0f00) >> 8;
    const val = code & 0xff;
    if (this.V[register] === val) {
      this.pc += 2;
    }
  }

  /*
        4xkk - SNE Vx, byte
        Skip next instruction if Vx != kk.
    */
  private opSkipNotEqual(code: opCode) {
    const register = (code & 0x0f00) >> 8;
    const val = code & 0xff;
    if (this.V[register] !== val) {
      this.pc += 2;
    }
  }

  /*
        5xy0 - SE Vx, Vy
        Skip next instruction if Vx = Vy.
    */
  private opSkipRegEqual(code: opCode) {
    const regX = (code & 0x0f00) >> 8;
    const regY = (code & 0x00f0) >> 4;
    if (this.V[regX] == this.V[regY]) {
      this.pc += 2;
    }
  }

  /*
     6xkk - LD Vx, byte
     Set Vx = kk.
    */
  private opSet(code: opCode) {
    const register = (code & 0xf00) >> 8;
    const value = code & 0xff;
    this.V[register] = value;
  }

  /*
     7xkk - ADD Vx, byte
     Set Vx = Vx + kk.
    */
  private opAdd(code: opCode) {
    const reg = (code & 0x0f00) >> 8;
    const val = code & 0xff;

    this.V[reg] = (this.V[reg] + val) & 0xff;
  }

  private registerOp(
    code: opCode,
    f: (regX: number, regY: number) => number
  ): void {
    const regX = (code & 0x0f00) >> 8;
    const regY = (code & 0x00f0) >> 4;
    this.V[regX] = f(this.V[regX], this.V[regY]);
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
      x + y > 255 ? (this.V[0xf] = 1) : (this.V[0xf] = 0);
      return (x + y) & 0xff;
    });
  }

  /*
     8xy5 - SUB Vx, Vy  
     Set Vx = Vx - Vy, set VF = NOT borrow.
    */
  private opSUB(code: opCode) {
    this.registerOp(code, (x, y) => {
      x > y ? (this.V[0xf] = 1) : (this.V[0xf] = 0);
      return x - y;
    });
  }

  /*
     8xy6 - SHR Vx {, Vy}
     Set Vx = Vx SHR 1.
    */
  private opSHR(code: opCode) {
    this.registerOp(code, (x, _y) => {
      (x & 1) == 1 ? (this.V[0xf] = 1) : (this.V[0xf] = 0);
      return x >> 1;
    });
  }

  /*
     8xy7 - SUBN Vx, Vy
     Set Vx = Vy - Vx, set VF = NOT borrow.
    */
  private opSUBN(code: opCode) {
    this.registerOp(code, (x, y) => {
      y > x ? (this.V[0xf] = 1) : (this.V[0xf] = 0);
      return y - x;
    });
  }

  /*
     8xyE - SHL Vx {, Vy}
     Set Vx = Vx SHL 1.
    */
  private opSHL(code: opCode) {
    this.registerOp(code, (x, _y) => {
      (x & 0x80) == 0x80 ? (this.V[0xf] = 1) : (this.V[0xf] = 0);
      return (x << 1) & 0xff;
    });
  }

  /*
     9xy0 - SNE Vx, Vy
     Skip next instruction if Vx != Vy.
    */
  private opSNE(code: opCode) {
    const regX = (code & 0x0f00) >> 8;
    const regY = (code & 0x00f0) >> 4;
    if (this.V[regX] != this.V[regY]) {
      this.pc += 2;
    }
  }

  /*
     Annn - LD I, addr
     Set I = nnn.
    */
  private opSetIndexReg(code: opCode) {
    this.I = code & 0x0fff;
  }

  /*
     Bnnn - JP V0, addr
     Jump to location nnn + V0.
     TODO: increase PC or not??
    */
  private opJP(code: opCode) {
    const addr = code & 0xfff;
    this.pc = (addr + this.V[0]) & 0xffff;
  }

  /*
     Cxkk - RND Vx, byte
     Set Vx = random byte AND kk.
    */
  private opRND(code: opCode) {
    const reg = (code & 0xf00) >> 8;
    const val = code & 0xff;
    this.V[reg] = Math.floor(Math.random() * 256) & 0xff & val;
  }

  /* 
    Dxyn - DRW Vx, Vy, nibble
    Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
   */
  private opDraw(code: opCode) {
    const x = this.V[(code & 0x0f00) >> 8] % 64; // modulo screen width
    let y = this.V[(code & 0x00f0) >> 4] % 32; // modulo screen height
    const rowCount = code & 0xf;

    this.V[0xf] = 0;
    for (let row = 0; row < rowCount; row++) {
      let currentX = x;
      const line = this.memory[this.I + row];

      for (let i = 0; i < 8; i++) {
        const pixel = (line & (1 << (7 - i))) >> (7 - i);

        // collision detection
        if (pixel === 1 && this.display.getPixel(currentX, y) === 1) {
          this.V[0xf] = 1;
        }
        this.display.setPixel(currentX, y, pixel);
        currentX += 1;
        if (currentX > 64) {
          break;
        }
      }
      y += 1;
      if (y > 32) {
        break;
      }
    }
    this.redrawNeeded = true;
  }
  /*
     Ex9E - SKP Vx
     Skip next instruction if key with the value of Vx is pressed.
    */
  private opSKP(code: opCode) {
    throw new Error("not implemented yet");
  }

  /*
      ExA1 - SKNP Vx
      Skip next instruction if key with the value of Vx is not pressed.
    */
  private opSKNP(code: opCode) {
    throw new Error("not implemented yet");
  }

  /*
      Fx07 - LD Vx, DT
      Set Vx = delay timer value.
    */
  private opLdDelayTimer(code: opCode) {
    const reg = (code & 0xf00) >> 8;
    this.V[reg] = this.delayTimer.get();
  }

  /*
      Fx0A - LD Vx, K
      Wait for a key press, store the value of the key in Vx.
    */
  private opWaitForKey(code: opCode) {
    throw new Error("not implemented yet");
  }

  /*
      Fx15 - LD DT, Vx
      Set delay timer = Vx.
    */
  private opSetDelayTimer(code: opCode) {
    const reg = (code & 0xf00) >> 8;
    this.delayTimer.set(this.V[reg]);
  }

  /*
      Fx18 - LD ST, Vx
      Set sound timer = Vx.
    */
  private opSetSoundTimer(code: opCode) {
    const reg = (code & 0xf00) >> 8;
    this.soundTimer.set(this.V[reg]);
  }

  /*
       Fx1E - ADD I, Vx
       Set I = I + Vx.
    */
  private opSetIndex(code: opCode) {
    const reg = (code & 0xf00) >> 8;
    this.V[0xF] = 0;
    if (this.I + this.V[reg] > 0xFFF) {
      this.V[0xF] = 1;
    }
    this.I = (this.I + this.V[reg]) & 0xFFF;
  }

  /*
      Fx29 - LD F, Vx
      Set I = location of sprite for digit Vx.
    */
  private opLoadChar(code: opCode) {
    const reg = (code & 0xF00) >> 8;
    this.I = 0x50 + (5 * this.V[reg]);
  }

  /*
      Fx33 - LD B, Vx
      Store BCD representation of Vx in memory locations I, I+1, and I+2.
    */
  private opLDBCD(code: opCode) {
    const value = this.V[(code & 0xF00) >> 8];

    this.memory[this.I] = Math.floor(value / 100);
    this.memory[this.I + 1] = Math.floor((value % 100) / 10);
    this.memory[this.I + 2] = value % 10;
  }

  /*
      Fx55 - LD [I], Vx
      Store registers V0 through Vx in memory starting at location I.
    */
  private opStoreRegisters(code: opCode) {
    const reg = (code & 0xF00) >> 8;
    for (let x = 0; x <= reg; x++) {
      this.memory[this.I + x] = this.V[x];
    }
  }

  /*
      Fx65 - LD Vx, [I]
      Read registers V0 through Vx from memory starting at location I.
    */
  private opLoadRegisters(code: opCode) {
    const reg = (code & 0xF00) >> 8;
    for (let x = 0; x <= reg; x++) {
      this.V[x] = this.memory[this.I + x];
    }
  }
}

import { Cpu, opCode } from "@/chip8/Cpu";
import { Display } from "@/chip8/Display";
import { expect } from "chai";
import { mock } from "ts-mockito";

let cpu: Cpu;
const display: Display = mock(Display);

before(() => {
    cpu = new Cpu(display);
});

beforeEach(() => {
    cpu.pc = 0x200;
});

const setOpcode = (opcode: opCode) => {
    cpu.memory[0x200] = (opcode & 0xFF00) >> 8;
    cpu.memory[0x201] = opcode & 0xFF;
};

describe("CPU", () => {
    // SE Vx, kk
    it("3xkk: should skip next instruction if Vx == kk", () => {
        cpu.V[0] = 0x10;
        setOpcode(0x3010);

        cpu.step();
        expect(cpu.pc).equal(0x204);
    });

    it("3xkk: should not skip next instruction if Vx != kk", () => {
        cpu.V[0] = 0x11;
        setOpcode(0x3010);

        cpu.step();
        expect(cpu.pc).equal(0x202);
    });

    // SNE 4xkk
    it("4xkk: should skip next instruction if Vx != kk", () => {
        cpu.V[0] = 0x10;
        setOpcode(0x4015);

        cpu.step();
        expect(cpu.pc).equal(0x204);
    });

    // SNE 4xkk
    it("4xkk: should not skip next instruction if Xv == kk", () => {
        cpu.V[0] = 0x10;
        setOpcode(0x4010);

        cpu.step();
        expect(cpu.pc).equal(0x202);
    });

    // LD Vx, byte
    it("6xkk: should set Vx to the value of kk", () => {
        setOpcode(0x6111);

        cpu.step();
        expect(cpu.V[1]).equal(0x11);
    });

    // ADD 7xkk
    it("7xkk: should add the value to the specified register and store the result", () => {
        cpu.V[0] = 0x10;
        setOpcode(0x7005);

        cpu.step();
        expect(cpu.V[0]).equal(0x15);
        expect(cpu.pc).to.equal(0x202);
    });

    // 8xy0 -> LD Vx, Vy
    it("8yx0: should store the value of register Vy in register Vx", () => {
        cpu.V[0] = 0x10;
        cpu.V[1] = 0x20;
        setOpcode(0x8010);

        cpu.step();
        expect(cpu.V[0]).equal(cpu.V[1]);
    });

    // 8xy1 -> OR Vx, Vy
    it("8xy1: should perform a bitwise OR on Vx and Vy ans store result in Vx", () => {
        cpu.V[0] = 0x40;
        cpu.V[1] = 0x80;
        setOpcode(0x8011);

        cpu.step();
        expect(cpu.V[0]).equal(0xC0);
    });

    // 8xy5 -> SUB Vx, Vy
    it("8xy5: should substract Vy from Vx and save result in Vx. x > y", () => {
        cpu.V[0] = 16;
        cpu.V[1] = 8;
        setOpcode(0x8015);

        cpu.step();
        expect(cpu.V[0]).equal(8);
        expect(cpu.V[0xF]).equal(1);
    });

    // 8xy5 -> SUB Vx, Vy
    it("8xy5: should substract Vy from Vx and save result in Vx. x < y", () => {
        cpu.V[0] = 8;
        cpu.V[1] = 16;
        setOpcode(0x8015);

        cpu.step();
        expect(cpu.V[0]).equal(0xF8);
        expect(cpu.V[0xF]).equal(0);
    });


    // 8xy6 - SHR Vx {, Vy}
    it("8xy6: should divide Vx by two. Vf = 0", () => {
        cpu.V[0x0] = 0x8;
        cpu.V[0xF] = 0;
        setOpcode(0x8016);

        cpu.step();
        expect(cpu.V[0]).equal(0x4);
        expect(cpu.V[0xF]).equal(0);
    });

    it("8xy6: should divide Vx by two. Vf = 1", () => {
        cpu.V[0x0] = 0x9;
        cpu.V[0xF] = 0;
        setOpcode(0x8016);

        cpu.step();
        expect(cpu.V[0]).equal(0x4);
        expect(cpu.V[0xF]).equal(1);
    });

    it("8xyE: should multiply Vx by two. Vf=0", () => {
        cpu.V[0x0] = 4;
        cpu.V[0xF] = 0;
        setOpcode(0x801E);

        cpu.step();
        expect(cpu.V[0]).equal(8);
        expect(cpu.V[0xf]).equal(0);
    });

    it("8xyE: should multiply Vx by two. Vf=1", () => {
        cpu.V[0x0] = 0xC0;
        cpu.V[0xF] = 0;
        setOpcode(0x801E);

        cpu.step();
        expect(cpu.V[0]).equal(0x80);
        expect(cpu.V[0xf]).equal(1);
    });

    it("fx29: should set I register to an address holding selected char", () => {
        cpu.V[0] = 0x1;
        setOpcode(0xF029);

        cpu.step();
        expect(cpu.I).equal(0x55);
    });

    it("fx33: shoud store byte in BCD format in memory - bigger than 100", () => {
        cpu.V[0] = 123;
        cpu.I = 0x500;
        setOpcode(0xF033);

        cpu.step();
        expect(cpu.memory[cpu.I]).equal(1);
        expect(cpu.memory[cpu.I + 1]).equal(2);
        expect(cpu.memory[cpu.I + 2]).equal(3);
    });

    it("fx33: shoud store byte in BCD format in memory - smaller than 100", () => {
        cpu.V[0] = 23;
        cpu.I = 0x500;
        setOpcode(0xF033);

        cpu.step();
        expect(cpu.memory[cpu.I]).equal(0);
        expect(cpu.memory[cpu.I + 1]).equal(2);
        expect(cpu.memory[cpu.I + 2]).equal(3);
    });

    it("fx55: should store registers V0 through Vx in memory starting at I", () => {
        for (let x = 0; x < 16; x++) {
            cpu.V[x] = x;
        }
        cpu.I = 0x500;
        setOpcode(0xFF55);

        cpu.step();
        for (let x = 0; x < 16; x++) {
            expect(cpu.memory[cpu.I + x]).equal(x);
        }
    });

    it("fx65: should store registers V0 through Vx in memory starting at I", () => {
        cpu.I = 0x500;
        for (let x = 0; x < 16; x++) {
            cpu.memory[cpu.I + x] = x;
        }
        setOpcode(0xFF65);

        cpu.step();
        for (let x = 0; x < 16; x++) {
            expect(cpu.V[x]).equal(x);
        }
    });
});

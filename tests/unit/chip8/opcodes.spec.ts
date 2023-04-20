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
})

const setOpcode = (opcode: opCode) => {
    cpu.memory[0x200] = (opcode & 0xFF00) >> 8;
    cpu.memory[0x201] = opcode & 0xFF;
}

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
        setOpcode(0x8016)

        cpu.step();
        expect(cpu.V[0]).equal(0x4);
        expect(cpu.V[0xF]).equal(1);
    });

    it("fx29: should set I register to an address holding selected char", () => {
        cpu.V[0] = 0x1;
        setOpcode(0xF029);

        cpu.step();
        expect(cpu.I).equal(0x55);
    });
});

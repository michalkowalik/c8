import { Cpu } from "@/chip8/Cpu";
import { Display } from "@/chip8/Display";
import { expect } from "chai";
import { mock } from "ts-mockito";

let cpu: Cpu;
const display: Display = mock(Display);

before(() => {
    cpu = new Cpu(display);
});

describe("CPU", () => {

    // ADD 7xkk
    it("should add the value to the specified register and store the result", () => {
        cpu.V[0] = 0x10;
        cpu.memory[0x200] = 0x70;
        cpu.memory[0x201] = 0x05;
        cpu.pc = 0x200;

        cpu.step();
        expect(cpu.V[0]).equal(0x15);
    });

    // 8xy0 -> LD Vx, Vy
    it("should store the value of register Vy in register Vx", () => {
        cpu.V[0] = 0x10;
        cpu.V[1] = 0x20;
        cpu.memory[0x200] = 0x80;
        cpu.memory[0x201] = 0x10;
        cpu.pc = 0x200;

        cpu.step();
        expect(cpu.V[0]).equal(cpu.V[1]);
    });

    // 8xy1 -> OR Vx, Vy
    it("should perform a bitwise OR on Vx and Vy ans store result in Vx", () => {
        cpu.V[0] = 0x40;
        cpu.V[1] = 0x80;
        cpu.memory[0x200] = 0x80;
        cpu.memory[0x201] = 0x11;
        cpu.pc = 0x200;

        cpu.step();
        expect(cpu.V[0]).equal(0xC0);
    });

    // 8xy6 - SHR Vx {, Vy}
    it("should divide Vx by two. Vf = 0", () => {
        cpu.V[0x0] = 0x8;
        cpu.V[0xF] = 0;

        cpu.memory[0x200] = 0x80;
        cpu.memory[0x201] = 0x16;
        cpu.pc = 0x200;

        cpu.step();
        expect(cpu.V[0]).equal(0x4);
        expect(cpu.V[0xF]).equal(0);
    });

    it("should divide Vx by two. Vf = 1", () => {
        cpu.V[0x0] = 0x9;
        cpu.V[0xF] = 0;

        cpu.memory[0x200] = 0x80;
        cpu.memory[0x201] = 0x16;
        cpu.pc = 0x200;

        cpu.step();
        expect(cpu.V[0]).equal(0x4);
        expect(cpu.V[0xF]).equal(1);
    });

    it("should set I register to an address holding selected char", () => {
        cpu.V[0] = 0x1;
        cpu.memory[0x200] = 0xF0;
        cpu.memory[0x201] = 0x29;
        cpu.pc = 0x200;
        cpu.I = 0;

        cpu.step();
        expect(cpu.I).equal(0x55);
    });

});
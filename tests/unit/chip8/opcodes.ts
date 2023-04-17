import { Cpu } from "@/chip8/Cpu";
import { expect } from "chai";

let cpu: Cpu;

before(() => {
    cpu = new Cpu(null);
});

describe("CPU", () => {
    it("should add the value to the specified register and store the result", () => {
        // Arrange
        cpu.V[0] = 0x10;
        cpu.memory[0x200] = 0x71;
        cpu.memory[0x201] = 0x05;
        cpu.pc = 0x200;

        // Act
        cpu.step();
    
        // Assert
        expect(cpu.V[0]).equal(0x15);  //.toBe(0x15);
      });
});
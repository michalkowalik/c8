export class CpuStatus {

    constructor(registers: number[], pc: number, i: number) {
        this.registers = registers;
        this.pc = pc;
        this.i = i;
    }

    registers: number[];
    pc: number;
    i: number;
}
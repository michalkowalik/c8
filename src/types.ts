export class CpuStatus {

    constructor(registers: number[], indexRegisters: number[]) {
        this.registers = registers;
        this.indexRegisters = indexRegisters;
    }

    registers: number[];
    indexRegisters: number[];
}
export class Stack<NumType> {
  private stack: NumType[];
  private sp: number;

  constructor(size: number) {
    this.stack = new Array(size);
    this.sp = 0;
  }

  public push(item: NumType): void {
    if (this.sp === this.stack.length) {
      throw new Error("Stack overvflow");
    }
    this.stack[this.sp] = item;
    this.sp += 1;
  }

  public pop(): NumType {
    if (this.sp == 0) {
      throw new Error("Can't pop from an empty stack!");
    }

    this.sp -= 1;
    return this.stack[this.sp + 1];
  }

  public getSp(): number {
    return this.sp;
  }
}

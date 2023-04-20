export class Timer {
  private intervalId: number | undefined;

  // I don't know if I need the callback at all ..
  // private readonly callback: () => void;

  private counter = 0;

  /*
    constructor(callback: () => void) {
      this.callback = callback;
    }
  */

  public start(): void {
    this.intervalId = setInterval(() => {
      if (this.counter > 0) {
        this.counter -= 1;
      }
      // this.callback();
    }, 1000 / 60);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  public set(counter: number) {
    this.counter = counter;
  }

  public get(): number {
    return this.counter;
  }
}

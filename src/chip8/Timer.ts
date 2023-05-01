export class Timer {
  private intervalId: number | undefined;

  private counter = 0;

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

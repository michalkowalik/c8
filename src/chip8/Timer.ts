class Timer {
    private intervalId: number | undefined;
    private readonly callback: () => void;
  
    constructor(callback: () => void) {
      this.callback = callback;
    }
  
    public start(): void {
      this.intervalId = setInterval(() => {
        this.callback();
      }, 1000 / 60);
    }
  
    public stop(): void {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
      }
    }
}
  
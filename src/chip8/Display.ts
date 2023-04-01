/* eslint-disable @typescript-eslint/no-empty-function */
// CHIP-8 display class

export class Display {

    private readonly width: number;
    private readonly height: number;
    private readonly pixelSize: number;
    private screenData: Uint8Array;
    private canvasContext: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, width = 64, height = 32, pixelSize = 8) {
        this.width = width;
        this.height = height;
        this.pixelSize = pixelSize;
        this.screenData = new Uint8Array(this.width * this.height);
        const canvasContext = canvas.getContext('2d');
        if(!canvasContext || !(canvasContext instanceof CanvasRenderingContext2D)) {
          throw new Error('Failed to get 2D context!');
        }
        this.canvasContext = canvasContext;
    }

    public clear(): void {
        this.screenData.fill(0);
    }

    public setPixel(x: number, y: number, value: number): void {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
          return;
        }
        this.screenData[y * this.width + x] = value;
      }

    // probably not needed at all?
    public getData(): Uint8Array {
        return this.screenData;
      }

    // render is the funny part
    public render(): void {
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        this.canvasContext.fillStyle = 'white';
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            if (this.screenData[y * this.width + x] === 1) {
              this.canvasContext.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
            }
          }
        }
      }
}
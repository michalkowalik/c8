/* eslint-disable @typescript-eslint/no-empty-function */
// CHIP-8 display class

export class Display {
  private readonly width: number;
  private readonly height: number;
  private readonly pixelSize: number;
  private screenData: Uint8Array;
  private canvasContext: CanvasRenderingContext2D;

  // off-screen canvas to draw on it
  private offScreenCanvas: OffscreenCanvas;
  private offScreenCanvasContext: OffscreenCanvasRenderingContext2D;

  constructor(
    canvas: HTMLCanvasElement,
    width = 64,
    height = 32,
    pixelSize = 8
  ) {
    this.width = width;
    this.height = height;
    this.pixelSize = pixelSize;
    this.screenData = new Uint8Array(this.width * this.height);

    this.offScreenCanvas = new OffscreenCanvas(width * pixelSize, height * pixelSize);
    const offScreenCanvasContext = this.offScreenCanvas.getContext("2d");
    if (!offScreenCanvasContext || !(offScreenCanvasContext instanceof OffscreenCanvasRenderingContext2D)) {
      throw new Error("Failed to get 2d context for the offScreen Canvas");
    }
    this.offScreenCanvasContext = offScreenCanvasContext;

    const canvasContext = canvas.getContext("2d");
    if (!canvasContext || !(canvasContext instanceof CanvasRenderingContext2D)) {
      throw new Error("Failed to get 2D context!");
    }
    this.canvasContext = canvasContext;
  }

  public clear(): void {
    this.screenData.fill(0);
    this.render();
  }

  // pixel value is a XOR between the current and new value
  public setPixel(x: number, y: number, value: number): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }
    this.screenData[y * this.width + x] ^= value;
  }

  public getPixel(x: number, y: number): number {
    return this.screenData[y * this.width + x];
  }

  // probably not needed at all?
  public getData(): Uint8Array {
    return this.screenData;
  }

  // render is the funny part
  public async render(): Promise<void> {
    this.offScreenCanvasContext.fillStyle = "black";
    this.offScreenCanvasContext.fillRect(
      0,
      0,
      this.offScreenCanvasContext.canvas.width,
      this.offScreenCanvasContext.canvas.height
    );

    this.offScreenCanvasContext.fillStyle = "white";
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.screenData[y * this.width + x] === 1) {
          this.offScreenCanvasContext.fillRect(
            x * this.pixelSize,
            y * this.pixelSize,
            this.pixelSize,
            this.pixelSize
          );
        }
      }
    }

    // what will happen here??
    this.canvasContext.drawImage(this.offScreenCanvas, 0, 0);
  }
}

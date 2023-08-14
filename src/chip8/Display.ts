/* eslint-disable @typescript-eslint/no-empty-function */

// CHIP-8 display class

export class Display {
    private readonly width: number;
    private readonly height: number;
    private screenData: Uint8Array;
    private bufferedScreenData: Uint8Array;

    private worker: Worker;

    // off-screen canvas to draw on it
    private offScreenCanvas: OffscreenCanvas;

    constructor(
        canvas: HTMLCanvasElement,
        width = 64,
        height = 32,
        pixelSize = 8
    ) {
        this.width = width;
        this.height = height;
        this.screenData = new Uint8Array(this.width * this.height);
        this.bufferedScreenData = new Uint8Array(this.width * this.height);

        this.worker = new Worker(
            new URL('../workers/OffScreenRendererWorker', import.meta.url),
            {type: 'module'});

        // listen to the events from the worker
        this.worker.addEventListener('message', message => {
            console.log("Worker says: " + message.data);
        })

        this.offScreenCanvas = canvas.transferControlToOffscreen();
        this.worker.postMessage(
            {
                canvas: this.offScreenCanvas,
                width: this.width,
                height: this.height,
                pixelSize: pixelSize
            },
            [this.offScreenCanvas]);
    }

    public clear(): void {
        this.screenData.fill(0);
        this.bufferedScreenData.fill(0);

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

    // render is the funny part
    public async render(): Promise<void> {
        this.worker.postMessage({screenData: this.screenData});
    }
}


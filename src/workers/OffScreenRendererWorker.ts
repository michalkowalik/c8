let offScreenCanvas: OffscreenCanvas;
let canvasContext: OffscreenCanvasRenderingContext2D;
let bufferedScreenData: Uint8Array;
let width: number;
let height: number;
let pixelSize: number;

self.onmessage = (e: MessageEvent<string>) => {
    if (typeof e.data == "object" && e.data["canvas"]) {
        offScreenCanvas = e.data["canvas"];
        const res = offScreenCanvas.getContext("2d");
        if (!res || !(res instanceof OffscreenCanvasRenderingContext2D)) {
            throw new Error("Could not obtain canvas context");
        }
        canvasContext = res;
        height = e.data["height"];
        width = e.data["width"];
        pixelSize = e.data["pixelSize"];
        bufferedScreenData = new Uint8Array(width * height);

        clearScreen();
    }

    // if an array -> render.
    if (typeof e.data == "object" && e.data["screenData"]) {
        render(e.data["screenData"]);
    }
}

// clear screen & screen data:
const clearScreen = () => {
    bufferedScreenData.fill(0);

    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
}

const render = (screenData: Uint8Array) => {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (screenData[y * width + x] !== bufferedScreenData[y * width + x]) {
                if (screenData[y * width + x] === 1) {
                    canvasContext.fillStyle = "white";
                } else {
                    canvasContext.fillStyle = "black";
                }

                canvasContext.fillRect(
                    x * pixelSize,
                    y * pixelSize,
                    pixelSize,
                    pixelSize
                );
            }
        }
    }
    bufferedScreenData = new Uint8Array(screenData);
}

export {};
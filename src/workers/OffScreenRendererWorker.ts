self.onmessage = (e: MessageEvent<string>) => {
    console.log("In Webworker: Received message: " + e.data)

    self.postMessage("I'm not ready yet!");
}

export {};
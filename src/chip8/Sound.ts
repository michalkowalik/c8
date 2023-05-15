export class Sound {
    private audioContext: AudioContext | undefined;
    private oscillator: OscillatorNode | undefined;
    private gainNode: GainNode | undefined;

    create() {
        if (this.audioContext instanceof AudioContext) {
            return;
        }

        // Initialize the AudioContext
        this.audioContext = new AudioContext();

        // Create the oscillator and gain node
        this.oscillator = this.audioContext.createOscillator();
        this.gainNode = this.audioContext.createGain();

        this.oscillator.connect(this.gainNode);
        // Connect the gain node to the destination
        this.gainNode.connect(this.audioContext.destination);

        this.oscillator.type = "square";
        this.oscillator.frequency.value = 1024;
        this.gainNode.gain.value = 0;

        this.oscillator.start();
    }

    public shout(): void {
        if (this.gainNode instanceof GainNode) {
            this.gainNode.gain.value = 0.05;
        }
    }

    public shutup(): void {
        if (this.gainNode instanceof GainNode) {
            this.gainNode.gain.value = 0;
        }
    }
}
export class Keyboard {

    private keyMap: { [key: string]: number; } = {
        // Map key codes to Chip-8 key values
        "1": 0x1,
        "2": 0x2,
        "3": 0x3,
        "4": 0xC,
        "q": 0x4,
        "w": 0x5,
        "e": 0x6,
        "r": 0xD,
        "a": 0x7,
        "s": 0x8,
        "d": 0x9,
        "f": 0xE,
        "z": 0xA,
        "x": 0x0,
        "c": 0xB,
        "v": 0xF,
    };

    public getKeyCodeForKey(key: string): number {
        return this.keyMap[key];
    }

}
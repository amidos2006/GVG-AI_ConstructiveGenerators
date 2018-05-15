class Frogs {
    static readonly GRASS: string = "grass";
    static readonly WATER: string = "water";
    static readonly STREET: string = "street";
    static readonly TRUCK_LEFT: string = "truckLeft";
    static readonly TRUCK_RIGHT: string = "truckRight";
    static readonly FAST_LEFT: string = "fastLeft";
    static readonly FAST_RIGHT: string = "fastRight";
    static readonly WALL: string = "wall";
    static readonly GOAL: string = "goal";
    static readonly LOG: string = "log";
    static readonly SPAWNER_SLOW: string = "spawnerSlow";
    static readonly SPAWNER_FAST: string = "spawnerFast";
    static readonly AVATAR: string = "avatar";

    private _charMap: any;

    constructor(charMap: any) {
        this._charMap = charMap;
    }

    getDifficultyParameters(diff: number, maxWidth:number, maxHeight:number): number[] {
        let width: number = Math.floor((maxWidth - 11) * diff + 3 * Math.random()) + 6;
        let height: number = Math.floor((maxHeight - 9) * diff + 3 * Math.random()) + 4;
        let streetPercentage: number = (1 + 0.5 * Math.random()) * diff;
        let waterPercentage: number = (2 + Math.random()) * diff;
        let safetyPercentage: number = 1 - diff;
        let maxStreetSequence: number = 0.3 + 0.5 * diff + 0.2 * Math.random();
        let maxWaterSequence: number = 0.3 + 0.5 * diff + 0.2 * Math.random();
        return [width, height, streetPercentage, waterPercentage, safetyPercentage, maxStreetSequence, maxWaterSequence];
    }

    adjustParameters(width: number, height: number, streetPercentage: number, waterPercentage: number,
        safetyPercentage: number, maxStreetSequence: number, maxWaterSequence: number): number[] {
        let parameters: number[] = [streetPercentage, waterPercentage, safetyPercentage,
            maxStreetSequence, maxWaterSequence];
        if (streetPercentage + waterPercentage + safetyPercentage == 0) {
            parameters[0] = 1;
            parameters[1] = 1;
            parameters[2] = 1;
        }
        parameters[0] = streetPercentage / (streetPercentage + waterPercentage + safetyPercentage);
        parameters[1] = waterPercentage / (streetPercentage + waterPercentage + safetyPercentage);
        parameters[2] = safetyPercentage / (streetPercentage + waterPercentage + safetyPercentage);
        parameters[3] = Math.floor(maxStreetSequence * 0.8 * height);
        parameters[4] = Math.floor(maxStreetSequence * 0.8 * height);
        return [Math.max(width, 6) + 2, Math.max(height, 4)].concat(parameters);
    }

    private getWallLine(width: number): string {
        let result: string = "";
        for (let i: number = 0; i < width; i++) {
            result += this._charMap[Frogs.WALL];
        }
        return result;
    }

    private getArray(width: number, base: number, added: number, num: number): number[] {
        let result: number[] = [];
        for (let j: number = 0; j < width; j++) {
            result.push(base);
        }
        let start = Math.floor(Math.random() * (width / num)) + 1;
        let done: boolean = false;
        for (let j: number = 0; j < num; j++) {
            let length = Math.floor(Math.random() * 4) + 1;
            for (let l = start; l < start + length; l++) {
                if (l >= width - 1) {
                    done = true;
                    break;
                }
                result[l] = added;
            }
            start += 2 * length + 1 + Math.floor(Math.random() * (width / num));
            if (done) {
                break;
            }
        }
        return result;
    }

    generate(width: number, height: number, streetPercentage: number, waterPercentage: number,
        safetyPercentage: number, maxStreetSequence: number, maxWaterSequence: number): string {
        let types: number[] = [];
        let map: number[][] = [];
        for (let i: number = 0; i < height; i++) {
            types.push(0);
            map.push([]);
            for (let j: number = 0; j < width; j++) {
                map[i].push(0);
            }
        }
        for (let i: number = 1; i < height - 1; i++) {
            let type: number = 0;
            let length: number = 1;
            let randomValue: number = Math.random();
            if (randomValue < streetPercentage) {
                type = 1;
                length = Math.floor(Math.random() * maxStreetSequence) + 1;
            }
            else if (randomValue < streetPercentage + waterPercentage) {
                type = 2;
                length = Math.floor(Math.random() * maxWaterSequence) + 1;
            }
            for (let j: number = 0; j < length; j++) {
                if (i >= height - 1) {
                    break;
                }
                else {
                    types[i] = type;
                    if (j > 0) {
                        i += 1;
                    }
                }
            }
        }
        let goalLocation: number = Math.floor(Math.random() * (width - 2)) + 1;
        map[0][goalLocation] = 3;
        map[0][0] = 4;
        map[0][width - 1] = 4;
        map[0][goalLocation - 1] = 4;
        map[0][goalLocation + 1] = 4;
        let avatarLocation: number = Math.floor(Math.random() * (width - 2)) + 1;
        map[height - 1][avatarLocation] = 5;
        map[height - 1][0] = 4;
        map[height - 1][width - 1] = 4;
        for (let i: number = 1; i < height - 1; i++) {
            let num: number = 0;
            let state: number = Math.floor(Math.random() * 2);
            switch (types[i]) {
                case 0:
                    map[i][0] = 4;
                    map[i][width-1] = 4;
                    break;
                case 1:
                    num = Math.floor(Math.random() * 0.4 * width) + 2;
                    map[i] = this.getArray(width, 1, 6 + state, num);
                    break;
                case 2:
                    for (let j: number = 0; j < width; j++) {
                        map[i][j] = 2;
                    }
                    num = Math.floor(Math.random() * 0.2 * width) + 1;
                    map[i] = this.getArray(width, 2, 8, num);
                    map[i][width - 2] = 8 + state;
                    map[i][width - 1] = 9;
                    break;
            }
        }
        let result: string = this.getWallLine(width) + "\n";
        let test: number = 0;
        for (let i: number = 0; i < map.length; i++) {
            for (let j: number = 0; j < map[i].length; j++) {
                switch (map[i][j]) {
                    case 0:
                        result += this._charMap[Frogs.GRASS];
                        break;
                    case 1:
                        result += this._charMap[Frogs.STREET];
                        break;
                    case 2:
                        result += this._charMap[Frogs.WATER];
                        break;
                    case 3:
                        result += this._charMap[Frogs.GOAL];
                        break;
                    case 4:
                        result += this._charMap[Frogs.WALL];
                        break;
                    case 5:
                        result += this._charMap[Frogs.AVATAR];
                        break;
                    case 6:
                        test = Math.floor(Math.random() * 2);
                        if (test == 1) {
                            result += this._charMap[Frogs.FAST_LEFT];
                        }
                        else {
                            result += this._charMap[Frogs.TRUCK_LEFT];
                        }
                        break;
                    case 7:
                        test = Math.floor(Math.random() * 2);
                        if (test == 1) {
                            result += this._charMap[Frogs.FAST_RIGHT];
                        }
                        else {
                            result += this._charMap[Frogs.TRUCK_RIGHT];
                        }
                        break;
                    case 8:
                        result += this._charMap[Frogs.LOG];
                        break;
                    case 9:
                        test = Math.floor(Math.random() * 2);
                        if (test == 1) {
                            result += this._charMap[Frogs.SPAWNER_SLOW];
                        }
                        else {
                            result += this._charMap[Frogs.SPAWNER_FAST];
                        }
                        break;
                }
            }
            result += "\n";
        }
        result += this.getWallLine(width);
        return result;
    }
}
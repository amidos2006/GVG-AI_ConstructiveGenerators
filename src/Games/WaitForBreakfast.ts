/// <reference path="../AStar.ts"/>

class WaitForBreakfast {
    static readonly EMPTY: string = "empty";
    static readonly WALL: string = "wall";
    static readonly EXIT: string = "exit";
    static readonly WAITER: string = "waiter";
    static readonly TARGET_TABLE: string = "targetTable";
    static readonly TARGET_LEFT: string = "targetLeft";
    static readonly TARGET_RIGHT: string = "targetRight";
    static readonly TARGET_UP: string = "targetUp";
    static readonly TARGET_DOWN: string = "targetDown";
    static readonly TABLE: string = "table";
    static readonly LEFT: string = "left";
    static readonly RIGHT: string = "right";
    static readonly UP: string = "up";
    static readonly DOWN: string = "down";
    static readonly AVATAR: string = "avatar";

    private _aStar: AStar;
    private _charMap: any;

    constructor(aStar: AStar, charMap: any) {
        this._aStar = aStar;
        this._charMap = charMap;
    }

    private getDistance(p1: any, p2: any): number {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }

    private getRandomLocation(width: number, height: number): any {
        return {
            x: Math.floor(Math.random() * width) + 1,
            y: Math.floor(Math.random() * height) + 1
        }
    }

    private placeTable(map: number[][], start: any, end: any): void {
        let dx: number = Math.sign(end.x - start.x);
        let dy: number = Math.sign(end.y - start.y);
        let current: any = { x: start.x, y: start.y };
        while (this.getDistance(current, end) != 0) {
            map[current.y][current.x] = 2;
            current.x += dx;
            current.y += dy;
        }
    }

    private removeTable(map: number[][], start: any, end: any): void {
        let dx: number = Math.sign(end.x - start.x);
        let dy: number = Math.sign(end.y - start.y);
        let current: any = { x: start.x, y: start.y };
        while (this.getDistance(current, end) != 0) {
            map[current.y][current.x] = 0;
            current.x += dx;
            current.y += dy;
        }
    }

    private putTables(map: number[][], start: any, waiter: any, target: any, maxNumber: number): number {
        maxNumber = Math.min(maxNumber, Math.floor(map.length / 2), Math.floor(map[0].length / 2));
        let length: number = Math.floor(Math.random() * maxNumber) + 1;
        let location: any = this.getRandomLocation(map[0].length - length - 2, map.length - length - 2);
        if (Math.random() < 0.4) {
            length = 1;
        }
        let dir: number = Math.round(Math.random());
        this.placeTable(map, location, { x: location.x + dir * length, y: location.y + (1 - dir) * length });
        while (!this._aStar.pathExisits(map, start, target) ||
            !this._aStar.pathExisits(map, target, waiter)) {
            this.removeTable(map, location, { x: location.x + dir * length, y: location.y + (1 - dir) * length });
            length = Math.floor(Math.random() * maxNumber) + 1;
            if (Math.random() < 0.4) {
                length = 1;
            }
            dir = Math.round(Math.random());
            location = this.getRandomLocation(map[0].length - length - 2, map.length - length - 2);
            this.placeTable(map, location, { x: location.x + dir * length, y: location.y + (1 - dir) * length });
        }
        return length;
    }

    private shuffleArray(array: any[]): void {
        for (let i: number = 0; i < array.length; i++) {
            let index: number = Math.floor(Math.random() * array.length);
            let temp: number = array[index];
            array[index] = array[i];
            array[i] = temp;
        }
    }

    private placeChairs(map: number[][], table: any, index: number): void {
        let points: any[] = [];
        for (let x: number = -1; x <= 1; x++) {
            for (let y: number = -1; y <= 1; y++) {
                if ((x == 0 || y == 0) && !(x == 0 && y == 0)) {
                    points.push({ x: table.x + x, y: table.y + y });
                }
            }
        }
        this.shuffleArray(points);
        let prob: number = 1;
        for (let p of points) {
            if (map[p.y][p.x] == 0) {
                if (Math.random() < prob) {
                    map[p.y][p.x] = index;
                }
                prob /= 2;
            }
        }
    }

    getDifficultyParameters(diff: number, maxWidth:number, maxHeight:number): number[] {
        let width: number = Math.floor((maxWidth - 8) * diff + 3 * Math.random()) + 5;
        let height: number = Math.floor((maxHeight - 8) * diff + 3 * Math.random()) + 5;
        let tableNumbers: number = 0.7 * diff + 0.3 * Math.random();
        return [width, height, tableNumbers];
    }

    adjustParameters(width: number, height: number, tableNumbers: number): number[]{
        let parameters:number[] = [tableNumbers];
        parameters[0] = Math.floor(tableNumbers * 0.1 * width * height);
        return [Math.max(width,5), Math.max(height,5)].concat(parameters);
    }

    generate(roomWidth: number, roomHeight: number, tableNumbers: number): string {
        let map: number[][] = [];
        for (let y: number = 0; y < roomHeight; y++) {
            map.push([]);
            for (let x: number = 0; x < roomWidth; x++) {
                if (x == 0 || y == 0 || y == roomHeight - 1 || x == roomWidth - 1) {
                    map[y].push(1);
                }
                else {
                    map[y].push(0);
                }
            }
        }
        let start: any = {
            x: Math.round(Math.random()) * (roomWidth - 1),
            y: Math.floor(Math.random() * (roomHeight - 2)) + 1
        };
        if (Math.random() < 0.5) {
            start = {
                x: Math.floor(Math.random() * (roomWidth - 2)) + 1,
                y: Math.round(Math.random()) * (roomHeight - 1)
            };
        }
        map[start.y][start.x] = 0;
        let waiter: any = {
            x: Math.round(Math.random()) * (roomWidth - 1),
            y: Math.floor(Math.random() * (roomHeight - 2)) + 1
        };
        if (Math.random() < 0.5) {
            waiter = {
                x: Math.floor(Math.random() * (roomWidth - 2)) + 1,
                y: Math.round(Math.random()) * (roomHeight - 1)
            };
        }
        while (this.getDistance(start, waiter) < Math.min(roomWidth, roomHeight)) {
            waiter = {
                x: Math.round(Math.random()) * (roomWidth - 1),
                y: Math.floor(Math.random() * (roomHeight - 2)) + 1
            };
            if (Math.random() < 0.5) {
                waiter = {
                    x: Math.floor(Math.random() * (roomWidth - 2)) + 1,
                    y: Math.round(Math.random()) * (roomHeight - 1)
                };
            }
        }
        map[waiter.y][waiter.x] = 0;

        let target: any = this.getRandomLocation(roomWidth - 2, roomHeight - 2);
        while (this.getDistance(start, target) + this.getDistance(target, waiter) < Math.min(roomWidth, roomHeight) &&
            this.getDistance(start, target) < Math.min(roomWidth, roomHeight) / 2 &&
            this.getDistance(target, waiter) < Math.min(roomWidth, roomHeight) / 2) {
            target = this.getRandomLocation(roomWidth - 2, roomHeight - 2);
        }

        while (tableNumbers > 0) {
            let length: number = this.putTables(map, start, waiter, target, tableNumbers);
            if(length == 0){
                break;
            }
            tableNumbers -= length;
        }

        map[target.y][target.x] = 3;
        map[waiter.y][waiter.x] = 4;
        map[start.y][start.x] = 5;
        if (start.x == 0) {
            map[start.y][1] = 6;
        }
        if (start.x == roomWidth - 1) {
            map[start.y][roomWidth - 2] = 6;
        }
        if (start.y == 0) {
            map[1][start.x] = 6;
        }
        if (start.y == roomHeight - 1) {
            map[roomHeight - 2][start.x] = 6;
        }

        for (let y: number = 0; y < map.length; y++) {
            for (let x: number = 0; x < map[y].length; x++) {
                if (map[y][x] == 2) {
                    this.placeChairs(map, { x: x, y: y }, 7);
                }
                if (map[y][x] == 3) {
                    this.placeChairs(map, { x: x, y: y }, 8);
                }
            }
        }

        let targetChair: boolean = false;
        let levelString: string = "";
        for (let y: number = 0; y < roomHeight; y++) {
            for (let x: number = 0; x < roomWidth; x++) {
                switch (map[y][x]) {
                    case 0:
                        levelString += this._charMap[WaitForBreakfast.EMPTY];
                        break;
                    case 1:
                        levelString += this._charMap[WaitForBreakfast.WALL];
                        break;
                    case 2:
                        levelString += this._charMap[WaitForBreakfast.TABLE];
                        break;
                    case 3:
                        levelString += this._charMap[WaitForBreakfast.TARGET_TABLE];
                        break;
                    case 4:
                        levelString += this._charMap[WaitForBreakfast.WAITER];
                        break;
                    case 5:
                        levelString += this._charMap[WaitForBreakfast.EXIT];
                        break;
                    case 6:
                        levelString += this._charMap[WaitForBreakfast.AVATAR];
                        break;
                    case 7:
                        if (map[y + 1][x] == 2) {
                            levelString += this._charMap[WaitForBreakfast.UP];
                        }
                        else if (map[y - 1][x] == 2) {
                            levelString += this._charMap[WaitForBreakfast.DOWN];
                        }
                        else if (map[y][x + 1] == 2) {
                            levelString += this._charMap[WaitForBreakfast.LEFT];
                        }
                        else if (map[y][x - 1] == 2) {
                            levelString += this._charMap[WaitForBreakfast.RIGHT];
                        }
                        break;
                    case 8:
                        if (targetChair) {
                            levelString += this._charMap[WaitForBreakfast.EMPTY];
                            continue;
                        }
                        targetChair = true;
                        if (map[y + 1][x] == 3) {
                            levelString += this._charMap[WaitForBreakfast.TARGET_UP];
                        }
                        else if (map[y - 1][x] == 3) {
                            levelString += this._charMap[WaitForBreakfast.TARGET_DOWN];
                        }
                        else if (map[y][x + 1] == 3) {
                            levelString += this._charMap[WaitForBreakfast.TARGET_LEFT];
                        }
                        else if (map[y][x - 1] == 3) {
                            levelString += this._charMap[WaitForBreakfast.TARGET_RIGHT];
                        }
                        break;
                }
            }
            levelString += "\n";
        }
        return levelString;
    }
}
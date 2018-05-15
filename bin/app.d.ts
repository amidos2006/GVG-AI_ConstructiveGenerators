declare class AStar {
    private _empty;
    constructor(empty: number[]);
    private insideMap(map, p);
    private passable(map, p);
    pathExisits(map: number[][], start: any, end: any): boolean;
}
declare class WaitForBreakfast {
    static readonly EMPTY: string;
    static readonly WALL: string;
    static readonly EXIT: string;
    static readonly WAITER: string;
    static readonly TARGET_TABLE: string;
    static readonly TARGET_LEFT: string;
    static readonly TARGET_RIGHT: string;
    static readonly TARGET_UP: string;
    static readonly TARGET_DOWN: string;
    static readonly TABLE: string;
    static readonly LEFT: string;
    static readonly RIGHT: string;
    static readonly UP: string;
    static readonly DOWN: string;
    static readonly AVATAR: string;
    private _aStar;
    private _charMap;
    constructor(aStar: AStar, charMap: any);
    private getDistance(p1, p2);
    private getRandomLocation(width, height);
    private placeTable(map, start, end);
    private removeTable(map, start, end);
    private putTables(map, start, waiter, target, maxNumber);
    private shuffleArray(array);
    private placeChairs(map, table, index);
    getDifficultyParameters(diff: number, maxWidth: number, maxHeight: number): number[];
    adjustParameters(width: number, height: number, tableNumbers: number): number[];
    generate(roomWidth: number, roomHeight: number, tableNumbers: number): string;
}
declare class ZenPuzzle {
    static readonly AVATAR: string;
    static readonly ROCK: string;
    static readonly TILE: string;
    static readonly EMPTY: string;
    private _hilbert2D;
    private _charMap;
    constructor(hilbert2D: any, charMap: any);
    private sign(value);
    private putZeroes(map, start, end);
    private appendEmpty(rows, columns);
    getDifficultyParameters(diff: number, maxWidth: number, maxHeight: number): number[];
    adjustParameters(width: number, height: number, borderX?: number, borderY?: number): number[];
    generate(boardWidth: number, boardHeight: number, borderX?: number, borderY?: number): string;
}
declare class CellularAutomata {
    private _solidFlipNum;
    private _emptyFlipNum;
    private _tinySolidNum;
    constructor(solidFlipNum: number, emptyFlipNum: number, tinySolidNum: number);
    private checkNumSolid(map, p, four?);
    private getUnlabeledLocation(map);
    private labelMap(map, start, label);
    private getEmptyRegions(map);
    private checkNumEmpty(map, p, four?);
    private tinySolid(map);
    private connect(map, p1, p2);
    private clone(map);
    generate(width: number, height: number, solidPercentage: number, iterations: number): number[][];
}
declare class Boulderdash {
    static readonly WALL: string;
    static readonly DIRT: string;
    static readonly EMPTY: string;
    static readonly CRAB: string;
    static readonly BUTTERFLY: string;
    static readonly BOULDER: string;
    static readonly AVATAR: string;
    static readonly GEM: string;
    static readonly EXIT: string;
    private _ca;
    private _aStar;
    private _charMap;
    constructor(ca: CellularAutomata, aStar: AStar, charMap: any);
    private getRandomEmptyPlace(map);
    private getAllPossibleLocations(map);
    private distance(p1, p2);
    private reachable(map, start, locations);
    private distanceToGems(loc, gems);
    private assignEmptyArea(map, start, length, dir);
    getDifficultyParameters(diff: number, maxWidth: number, maxHeight: number): number[];
    adjustParameters(width: number, height: number, solidPercentage: number, smoothness: number, enemies: number, boulders: number, extraGems: number): number[];
    generate(width: number, height: number, solidPercentage: number, smoothness: number, enemies: number, boulders: number, extraGems: number): string;
}
declare class Cell {
    private _walls;
    marked: boolean;
    constructor();
    unlockDirection(dir: any): void;
    getWall(dir: any): boolean;
}
declare class Maze {
    constructor();
    generate(width: number, height: number): number[][];
}
declare class Zelda {
    static readonly EXIT: string;
    static readonly AVATAR: string;
    static readonly KEY: string;
    static readonly MONSTER_QUICK: string;
    static readonly MONSTER_NORMAL: string;
    static readonly MONSTER_SLOW: string;
    static readonly WALL: string;
    static readonly EMPTY: string;
    private _maze;
    private _charMap;
    constructor(maze: Maze, charMap: any);
    private getAllPossibleLocations(map);
    private getAllSeparatorWalls(map);
    private distance(p1, p2);
    getDifficultyParameters(diff: number, maxWidth: number, maxHeight: number): number[];
    adjustParameters(width: number, height: number, openess: number, enemies: number): number[];
    generate(width: number, height: number, openess: number, enemies: number): string;
}
declare class Region {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    getVerticalSplit(minWidth: number): Region[];
    getHorizontalSplit(minHeight: number): Region[];
}
declare class BSP {
    private _roomWidth;
    private _roomHeight;
    private _width;
    private _height;
    constructor(roomWidth: number, roomHeight: number);
    private shuffleArray(array);
    private sign(value);
    private connect(map, p1, p2);
    generate(width: number, height: number, rooms: number): number[][];
}
declare class CookMePasta {
    static readonly EMPTY: string;
    static readonly WALL: string;
    static readonly AVATAR: string;
    static readonly DOOR: string;
    static readonly KEY: string;
    static readonly PASTA: string;
    static readonly BOILING: string;
    static readonly TOMATO: string;
    static readonly FISH: string;
    private _bsp;
    private _aStar;
    private _charMap;
    constructor(bsp: BSP, aStar: AStar, charMap: any);
    private getDistance(p1, p2);
    private getAllPossibleLocations(map);
    private getEnterHallways(map);
    private checkNumEmpty(map, p);
    getDifficultyParameters(diff: number, maxWidth: number, maxHeight: number): number[];
    adjustParameters(width: number, height: number, rooms: number, doors: number): number[];
    generate(width: number, height: number, rooms: number, doors: number): string;
}
declare class Frogs {
    static readonly GRASS: string;
    static readonly WATER: string;
    static readonly STREET: string;
    static readonly TRUCK_LEFT: string;
    static readonly TRUCK_RIGHT: string;
    static readonly FAST_LEFT: string;
    static readonly FAST_RIGHT: string;
    static readonly WALL: string;
    static readonly GOAL: string;
    static readonly LOG: string;
    static readonly SPAWNER_SLOW: string;
    static readonly SPAWNER_FAST: string;
    static readonly AVATAR: string;
    private _charMap;
    constructor(charMap: any);
    getDifficultyParameters(diff: number, maxWidth: number, maxHeight: number): number[];
    adjustParameters(width: number, height: number, streetPercentage: number, waterPercentage: number, safetyPercentage: number, maxStreetSequence: number, maxWaterSequence: number): number[];
    private getWallLine(width);
    private getArray(width, base, added, num);
    generate(width: number, height: number, streetPercentage: number, waterPercentage: number, safetyPercentage: number, maxStreetSequence: number, maxWaterSequence: number): string;
}
declare let generators: any;
declare let parameterSize: any;
declare let paddingChars: any;
declare function padLevels(level: string, maxWidth: number, maxHeight: number, character: string): string;
declare let game: string;
declare let levelFile: string;
declare let maxWidth: number;
declare let maxHeight: number;
declare let parameters: number[];
declare let level: string;
declare let fs: any;

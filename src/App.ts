/// <reference path="Games/Waitforbreakfast.ts"/>
/// <reference path="Games/ZenPuzzle.ts"/>
/// <reference path="Games/Boulderdash.ts"/>
/// <reference path="Games/Zelda.ts"/>
/// <reference path="Games/CookMePasta.ts"/>
/// <reference path="Games/Frogs.ts"/>

let generators:any = {
    "boulderdash": new Boulderdash(new CellularAutomata(5, 4, -1), new AStar([0, 2]), {
        [Boulderdash.EXIT]: 'e', [Boulderdash.AVATAR]: 'A', [Boulderdash.WALL]: 'w', [Boulderdash.DIRT]: '.',
        [Boulderdash.EMPTY]: '-', [Boulderdash.GEM]: 'x', [Boulderdash.CRAB]: 'c', [Boulderdash.BUTTERFLY]: 'b',
        [Boulderdash.BOULDER]: 'o'
    }),
    "cookmepasta": new CookMePasta(new BSP(3, 3), new AStar([0, 2]), {
        [CookMePasta.EMPTY]: '.', [CookMePasta.WALL]: 'w', [CookMePasta.PASTA]: 'p', [CookMePasta.BOILING]: 'b',
        [CookMePasta.TOMATO]: 'o', [CookMePasta.FISH]: 't', [CookMePasta.KEY]: 'k', [CookMePasta.DOOR]: 'l',
        [CookMePasta.AVATAR]: 'A'
    }),
    "waitforbreakfast": new WaitForBreakfast(new AStar([0]), {
        [WaitForBreakfast.WALL]: "w", [WaitForBreakfast.EMPTY]: ".", [WaitForBreakfast.TABLE]: "o",
        [WaitForBreakfast.TARGET_TABLE]: "t", [WaitForBreakfast.WAITER]: "k", [WaitForBreakfast.EXIT]: "e",
        [WaitForBreakfast.AVATAR]: "A", [WaitForBreakfast.LEFT]: "r", [WaitForBreakfast.RIGHT]: "l",
        [WaitForBreakfast.UP]: "f", [WaitForBreakfast.DOWN]: "b", [WaitForBreakfast.TARGET_LEFT]: "3",
        [WaitForBreakfast.TARGET_RIGHT]: "2", [WaitForBreakfast.TARGET_UP]: "0", [WaitForBreakfast.TARGET_DOWN]: "1"
    }),
    "zelda": new Zelda(new Maze(), {
        [Zelda.EMPTY]: '.', [Zelda.WALL]: 'w', [Zelda.KEY]: '+', [Zelda.AVATAR]: 'A', [Zelda.EXIT]: 'g',
        [Zelda.MONSTER_SLOW]: '1', [Zelda.MONSTER_NORMAL]: '2', [Zelda.MONSTER_QUICK]: '3'
    }),
    "zenpuzzle": new ZenPuzzle(require('hilbert').Hilbert2d, {
        [ZenPuzzle.AVATAR]: "A", [ZenPuzzle.EMPTY]: ".",
        [ZenPuzzle.TILE]: "g", [ZenPuzzle.ROCK]: "r"
    }),
    "frogs": new Frogs({
        [Frogs.GRASS]: "+", [Frogs.STREET]: ".", [Frogs.WATER]: "0", [Frogs.LOG]: "=", [Frogs.AVATAR]: "A",
        [Frogs.TRUCK_LEFT]: "_", [Frogs.FAST_LEFT]: "l", [Frogs.TRUCK_RIGHT]: "-", [Frogs.FAST_RIGHT]: "x",
        [Frogs.WALL]: "w", [Frogs.SPAWNER_FAST]: "1", [Frogs.SPAWNER_SLOW]: "3", [Frogs.GOAL]: "g"
    })
}

let parameterSize: any = {
    "boulderdash": 5,
    "cookmepasta": 2,
    "waitforbreakfast": 1,
    "zelda": 2,
    "zenpuzzle": 2,
    "frogs": 5
}

let paddingChars:any = {
    "boulderdash": 'w',
    "cookmepasta": 'w',
    "waitforbreakfast": 'w',
    "zelda": 'w',
    "zenpuzzle": '.',
    "frogs": 'w'
}

function padLevels(level: string, maxWidth: number, maxHeight: number, character:string): string{
    if (maxWidth <= 0 || maxHeight <= 0) {
        return level;
    }
    let levelLines: string[] = level.split("\n");
    for(let i:number=0; i<levelLines.length; i++){
        if(levelLines[i].trim().length == 0){
            levelLines.splice(i, 1);
            i--;
        }
    }
    let padHorizontal: number = maxWidth - levelLines[0].length;
    let padVertical: number = maxHeight - levelLines.length;
    let padLeft: number = Math.floor(padHorizontal / 2);
    let padRight: number = padHorizontal - padLeft;
    let padTop: number = Math.floor(padVertical / 2);
    let padBot: number = padVertical - padTop;
    let result: string = "";
    for (let i: number = 0; i < padTop; i++) {
        for (let j: number = 0; j < maxWidth; j++) {
            result += character;
        }
        result += "\n";
    }
    for (let i: number = 0; i < levelLines.length; i++) {
        if(levelLines[i].trim().length == 0){
            continue;
        }
        for (let j: number = 0; j < padLeft; j++) {
            result += character;
        }
        result += levelLines[i];
        for (let j: number = 0; j < padRight; j++) {
            result += character;
        }
        result += "\n";
    }
    for (let i: number = 0; i < padBot; i++) {
        for (let j: number = 0; j < maxWidth; j++) {
            result += character;
        }
        result += "\n";
    }
    return result;
}

let game:string = process.argv[2];
let levelFile:string = process.argv[3];
let maxWidth:number = 0;
let maxHeight:number = 0;
let parameters: number[] = [];
if(process.argv[4] != "difficulty"){
    let width:number = parseInt(process.argv[4]);
    let height:number = parseInt(process.argv[5]);
    for (let i: number = 0; i < parameterSize[game]; i++) {
        if (i + 6 < process.argv.length) {
            parameters.push(parseFloat(process.argv[i + 6]));
        }
        else {
            parameters.push(Math.random());
        }
    }
    parameters = [width, height].concat(parameters);
}
else{
    maxWidth = parseInt(process.argv[6]);
    maxHeight = parseInt(process.argv[7]);
    parameters = generators[game].getDifficultyParameters(parseFloat(process.argv[5]), maxWidth, maxHeight);
    // console.log(parameters);
}

parameters = generators[game].adjustParameters.apply(generators[game], parameters);
let level: string = generators[game].generate.apply(generators[game], parameters);
level = padLevels(level, maxWidth, maxHeight, paddingChars[game]);

let fs = require('fs');
fs.writeFileSync(levelFile, level);
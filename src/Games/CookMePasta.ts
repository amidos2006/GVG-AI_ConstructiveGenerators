/// <reference path="../BSP.ts"/>
/// <reference path="../AStar.ts"/>

class CookMePasta{
    static readonly EMPTY:string = "empty";
    static readonly WALL:string = "wall";
    static readonly AVATAR:string = "avatar";
    static readonly DOOR:string = "door";
    static readonly KEY:string = "key";
    static readonly PASTA:string = "pasta";
    static readonly BOILING:string = "boiling";
    static readonly TOMATO:string = "tomato";
    static readonly FISH:string = "fish";

    private _bsp:BSP;
    private _aStar:AStar;
    private _charMap:any;

    constructor(bsp:BSP, aStar:AStar, charMap:any){
        this._bsp = bsp;
        this._aStar = aStar;
        this._charMap = charMap;
    }

    private getDistance(p1: any, p2: any): number {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }

    private getAllPossibleLocations(map: number[][]): any[] {
        let possibleLocations: any[] = [];
        for (let x: number = 0; x < map[0].length; x++) {
            for (let y: number = 0; y < map.length; y++) {
                if (map[y][x] == 0 && map[y-1][x] == 0 && map[y+1][x] == 0 && map[y][x-1] == 0 && map[y][x+1] == 0) {
                    possibleLocations.push({ x: x, y: y });
                }
            }
        }
        return possibleLocations;
    }

    private getEnterHallways(map:number[][]):any[]{
        let possibleLocations: any[] = [];
        for (let x: number = 0; x < map[0].length; x++) {
            for (let y: number = 0; y < map.length; y++) {
                if (map[y][x] == 0) {
                    if(((map[y][x - 1] == 1 && map[y][x + 1] == 1)||
                        (map[y - 1][x] == 1 && map[y + 1][x] == 1)) && 
                        this.checkNumEmpty(map, {x:x, y:y}) > 2){
                        possibleLocations.push({ x: x, y: y });
                    }
                }
            }
        }
        return possibleLocations;
    }

    private checkNumEmpty(map: number[][], p: any) {
        let value: number = 0;
        for (let y: number = -1; y <= 1; y++) {
            for (let x: number = -1; x <= 1; x++) {
                if (x == 0 && y == 0) {
                    continue;
                }
                if (map[p.y + y][p.x + x] == 0) {
                    value += 1;
                }
            }
        }
        return value;
    }

    getDifficultyParameters(diff: number, maxWidth:number, maxHeight:number): number[] {
        let width: number = Math.floor((maxWidth - 14) * diff + 2 * Math.random()) + 12;
        let height: number = Math.floor((maxHeight - 14) * diff + 2 * Math.random()) + 12;
        let rooms:number = 0.5 * diff + 0.3 + 0.2 * Math.random();
        let doors:number = 0.7 * diff + 0.1 + 0.2 * Math.random();
        return [width, height, rooms, doors];
    }

    adjustParameters(width: number, height: number, rooms: number, doors: number): number[] {
        let parameters:number[] = [rooms, doors];
        parameters[0] = Math.floor(rooms * 0.05 * width * height + 1);
        parameters[1] = Math.floor(doors * 0.05 * width * height);
        return [Math.max(width, 12), Math.max(height, 12)].concat(parameters);
    }

    generate(width:number, height:number, rooms:number, doors:number):string{
        let map:number[][] = this._bsp.generate(width, height, rooms);
        let locs:any[] = this.getAllPossibleLocations(map);
        locs.sort((a,b)=>{return Math.random() - 0.5});
        let avatar:any = locs.splice(0, 1)[0];
        map[avatar.y][avatar.x] = 2;
        let hallways:any = this.getEnterHallways(map);
        hallways.sort((a,b)=>{return Math.random() - 0.5});
        let key:boolean = false;
        for(let l of hallways){
            if(doors == 0){
                break;
            }
            key = true;
            map[l.y][l.x] = 3;
            doors -= 1;
        }
        if(key){
            locs.sort((a, b)=>{return this.getDistance(b, avatar) - this.getDistance(a, avatar) + 4 * (Math.random() - 0.5)});
            for(let i:number=0; i<locs.length; i++){
                if(this._aStar.pathExisits(map, avatar, locs[i])){
                    let l:any = locs.splice(i, 1)[0];
                    map[l.y][l.x] = 4;
                    break;
                }
            }
        }

        let comp: number = 4;
        while(comp > 0){
            locs = this.getAllPossibleLocations(map);
            locs.sort((a, b) => {
                let aReach = this._aStar.pathExisits(map, avatar, a)? 1:0;
                let bReach = this._aStar.pathExisits(map, avatar, b)? 1:0;
                return aReach + bReach + (Math.random() - 0.5);
            });
            let l: any = locs.splice(0, 1)[0];
            map[l.y][l.x] = 4 + comp;
            comp -= 1;
        }
        
        let result:string = "";
        for (let y: number = 0; y < map.length; y++) {
            for (let x: number = 0; x < map[y].length; x++) {
                switch (map[y][x]) {
                    case 0:
                        result += this._charMap[CookMePasta.EMPTY];
                    break;
                    case 1:
                        result += this._charMap[CookMePasta.WALL];
                    break;
                    case 2:
                        result += this._charMap[CookMePasta.AVATAR];
                    break;
                    case 3:
                        result += this._charMap[CookMePasta.DOOR];
                    break;
                    case 4:
                        result += this._charMap[CookMePasta.KEY];
                    break;
                    case 5:
                        result += this._charMap[CookMePasta.PASTA];
                    break;
                    case 6:
                        result += this._charMap[CookMePasta.TOMATO];
                    break;
                    case 7:
                        result += this._charMap[CookMePasta.FISH];
                    break;
                    case 8:
                        result += this._charMap[CookMePasta.BOILING];
                    break;
                }
            }
            result += "\n";
        }
        return result;
    }
}
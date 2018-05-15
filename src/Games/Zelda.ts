/// <reference path="../Maze.ts"/>

class Zelda{
    static readonly EXIT:string = "exit";
    static readonly AVATAR:string = "avatar";
    static readonly KEY:string = "key";
    static readonly MONSTER_QUICK:string = "monsterQuick";
    static readonly MONSTER_NORMAL:string = "monsterNormal";
    static readonly MONSTER_SLOW:string = "monsterSlow";
    static readonly WALL:string = "wall";
    static readonly EMPTY:string = "empty";

    private _maze:Maze;
    private _charMap:any;

    constructor(maze:Maze, charMap:any){
        this._maze = maze;
        this._charMap = charMap;
    }

    private getAllPossibleLocations(map: number[][]): any[] {
        let possibleLocations: any[] = [];
        for (let x: number = 0; x < map[0].length; x++) {
            for (let y: number = 0; y < map.length; y++) {
                if (map[y][x] == 0) {
                    possibleLocations.push({ x: x, y: y });
                }
            }
        }
        return possibleLocations;
    }

    private getAllSeparatorWalls(map:number[][]):any[]{
        let possibleLocations: any[] = [];
        for (let x: number = 1; x < map[0].length-1; x++) {
            for (let y: number = 1; y < map.length-1; y++) {
                if (map[y][x] == 1 && ((map[y-1][x] == 0 && map[y+1][x] == 0) || (map[y][x-1] == 0 && map[y][x+1] == 0))) {
                    possibleLocations.push({ x: x, y: y });
                }
            }
        }
        return possibleLocations;
    }

    private distance(p1: any, p2: any) {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }

    getDifficultyParameters(diff:number, maxWidth:number, maxHeight:number):number[]{
        let width: number = Math.floor(diff * Math.max(maxWidth - 6, 0) + 2 * Math.random()) + 4;
        let height: number = Math.floor(diff * Math.max(maxHeight - 6, 0) + 2 * Math.random()) + 4;
        let openess:number = (1 - diff) * 0.4 + 0.1 * Math.random();
        let enemies:number = diff * 0.5 + 0.1 * Math.random() + 0.4;
        return [width, height, openess, enemies];
    }

    adjustParameters(width: number, height: number, openess: number, enemies: number): number[]{
        let parameters:number[] = [openess, enemies];
        parameters[0] = Math.floor(openess * (width-1) * (height-1));
        parameters[1] = Math.floor(enemies * 0.05 * width * height);
        return [Math.max(width, 4), Math.max(height, 4)].concat(parameters);
    }

    generate(width:number, height:number, openess:number, enemies:number):string{
        let map:number[][] = this._maze.generate(Math.floor(width/2), Math.floor(height/2));
        let walls: any[] = this.getAllSeparatorWalls(map);
        walls.sort((a,b)=>{return Math.random()-0.5});
        for(let i:number=0; i<walls.length; i++){
            if(openess == 0){
                break;
            }
            map[walls[i].y][walls[i].x] = 0;
            openess -=1;
        }
        let locations:any[] = this.getAllPossibleLocations(map);
        locations.sort((a,b)=>{return Math.random()-0.5});
        let avatar:any = locations.splice(0, 1)[0];
        map[avatar.y][avatar.x] = 2;
        locations.sort((a, b) => { return this.distance(avatar, b) - this.distance(avatar, a) + 
            Math.min(width,height) * (2 * Math.random() - 1)})
        let exit:any = locations.splice(0, 1)[0];
        map[exit.y][exit.x] = 3;
        locations.sort((a, b) => { return this.distance(avatar, b) - this.distance(avatar, a) +
            this.distance(exit, b) - this.distance(exit, a) +
            Math.min(width, height) * (2 * Math.random() - 1)});
        let key:any = locations.splice(0, 1)[0];
        map[key.y][key.x] = 4;
        locations.sort((a, b) => { return this.distance(avatar, b) - this.distance(avatar, a) + 
            Math.min(width, height) * (2 * Math.random() - 1) })
        for(let l of locations){
            if(enemies == 0){
                break;
            }
            map[l.y][l.x] = 5 + Math.floor(Math.random()*3);
            enemies -= 1;
        }
        let result:string = "";
        for (let y: number = 0; y < map.length; y++) {
            for (let x: number = 0; x < map[y].length; x++) {
                switch (map[y][x]) {
                    case 0:
                        result += this._charMap[Zelda.EMPTY];
                    break;
                    case 1:
                        result += this._charMap[Zelda.WALL];
                    break;
                    case 2:
                        result += this._charMap[Zelda.AVATAR];
                    break;
                    case 3:
                        result += this._charMap[Zelda.EXIT];
                    break;
                    case 4:
                        result += this._charMap[Zelda.KEY];
                    break;
                    case 5:
                        result += this._charMap[Zelda.MONSTER_SLOW];
                    break;
                    case 6:
                        result += this._charMap[Zelda.MONSTER_NORMAL];
                    break;
                    case 7:
                        result += this._charMap[Zelda.MONSTER_QUICK];
                    break;
                }
            }
            result += "\n";
        }

        return result;
    }
}
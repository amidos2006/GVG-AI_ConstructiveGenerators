/// <reference path="../CellularAutomata.ts"/>
/// <reference path="../AStar.ts"/>

class Boulderdash{
    static readonly WALL:string = "wall";
    static readonly DIRT:string = "dirt";
    static readonly EMPTY:string = "empty";
    static readonly CRAB:string = "crab";
    static readonly BUTTERFLY:string = "butterfly";
    static readonly BOULDER:string = "boulder";
    static readonly AVATAR:string = "avatar";
    static readonly GEM:string = "gem";
    static readonly EXIT:string = "exit";

    private _ca:CellularAutomata;
    private _aStar:AStar;
    private _charMap:any;

    constructor(ca:CellularAutomata, aStar:AStar, charMap:any){
        this._ca = ca;
        this._aStar = aStar;
        this._charMap = charMap;
    }

    private getRandomEmptyPlace(map:number[][]):any{
        let p:any = {x:0, y:0};
        while(map[p.y][p.x] != 0){
            p.x = Math.floor(Math.random() * map[0].length);
            p.y = Math.floor(Math.random() * map.length);
        }
        return p;
    }

    private getAllPossibleLocations(map:number[][]):any[]{
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

    private distance(p1:any, p2:any){
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }

    private reachable(map:number[][], start:any, locations:any[]):boolean{
        for(let loc of locations){
            if(!this._aStar.pathExisits(map, start, loc)){
                return false;
            }
        }
        return true;
    }
    
    private distanceToGems(loc:any, gems:any[]):number{
        let dist:number = -1;
        for(let g of gems){
            if (dist == -1 || this.distance(loc, g) < dist){
                dist = this.distance(loc, g);
            }
        }
        return dist;
    }

    private assignEmptyArea(map:number[][], start:any, length:number, dir:number):void{
        let dx: number = dir * (2 * Math.round(Math.random()) - 1);
        let dy:number = (1 - dir) * (2 * Math.round(Math.random()) - 1);
        let current:any = {x:start.x+dx, y:start.y+dy};
        for(let i:number=0; i<length; i++){
            if(map[current.y][current.x] == 0){
                map[current.y][current.x] = 6;
            }
            else{
                break;
            }
            current.x += dx;
            current.y += dy;
        }
    }

    getDifficultyParameters(diff: number, maxWidth:number, maxHeight:number): number[] {
        let width: number = Math.floor((maxWidth - 12) * diff + 2 * Math.random()) + 10;
        let height: number = Math.floor((maxHeight - 12) * diff + 2 * Math.random()) + 10;
        let solidPercentage: number = 0.6 * diff + 0.2 + 0.2 * Math.random();
        let smoothness: number = 0.5 * (1 - diff) + 0.3 + 0.2 * Math.random();
        let enemies: number = (0.7 + 0.3 * Math.random()) * diff;
        let boulders: number = (0.7 + 0.3 * Math.random()) * diff;
        let extraGems:number = 0.7 * (1 - diff) + 0.1 + 0.2 * Math.random();
        return [width, height, solidPercentage, smoothness, enemies, boulders, extraGems];
    }

    adjustParameters(width:number, height:number, solidPercentage:number, smoothness:number, enemies:number, boulders:number, extraGems:number):number[]{
        let parameters:number[] = [solidPercentage, smoothness, enemies, boulders, extraGems];
        parameters[0] = solidPercentage * 0.5;
        parameters[1] = Math.floor(smoothness * 10 + 1);
        parameters[2] = Math.floor(enemies * 0.05 * width * height);
        parameters[4] = Math.floor(extraGems * 0.05 * width * height);
        parameters[3] = Math.floor(boulders * 2 * (10 + extraGems));
        return [Math.max(width, 10), Math.max(height, 10)].concat(parameters);
    }

    generate(width:number, height:number, solidPercentage:number, smoothness:number, enemies:number, boulders:number, extraGems:number):string{
        let map:number[][] = this._ca.generate(width, height, solidPercentage, smoothness);
        let start: any = this.getRandomEmptyPlace(map);
        let exit: any = this.getRandomEmptyPlace(map);
        while(this.distance(start, exit) < 4){
            exit = this.getRandomEmptyPlace(map);
        }

        let possibleLocations: any[] = this.getAllPossibleLocations(map);
        possibleLocations.sort((a, b)=>{return 2* Math.random() - 1});
        let gems:any[] = [];
        for(let p of possibleLocations){
            if(gems.length == 10 + extraGems){
                break;
            }
            if (!((p.x == start.x && p.y == start.y) || (p.x == exit.x && p.y == exit.y))) {
                gems.push(p);
                map[p.y][p.x] = 2;
            }
        }

        possibleLocations = this.getAllPossibleLocations(map);
        possibleLocations.sort((a, b) => {return this.distanceToGems(a, gems) - this.distanceToGems(b, gems) + 0.1 *(2*Math.random() - 1)});
        for(let p of possibleLocations){
            if(boulders == 0){
                break;
            }
            if (!(this.distance(p, start) > 4 && this.distance(p, exit) > 4)){
                continue;
            }
            map[p.y][p.x] = 3;
            if (this.reachable(map, start, gems.concat([exit]))){
                boulders -= 1;
            }
            else{
                map[p.y][p.x] = 0;
            }
        }

        possibleLocations = this.getAllPossibleLocations(map);
        possibleLocations.sort((a, b) => { return 2 * Math.random() - 1});
        for(let p of possibleLocations){
            if(enemies == 0){
                break;
            }
            if (this.distance(p, start) > 5 && this.distance(p, exit) > 2) {
                map[p.y][p.x] = 4 + Math.round(Math.random());
                enemies -= 1;
                this.assignEmptyArea(map, p, Math.floor(5 * Math.random()),
                    Math.round(Math.random()));
            }
        }
        map[start.y][start.x] = 7;
        map[exit.y][exit.x] = 8;

        let result:string = "";
        for(let y:number=0; y<map.length; y++){
            for(let x:number=0; x<map[y].length; x++){
                switch(map[y][x]){
                    case 0:
                        result += this._charMap[Boulderdash.DIRT];
                    break;
                    case 1:
                        result += this._charMap[Boulderdash.WALL];
                    break;
                    case 2:
                        result += this._charMap[Boulderdash.GEM]
                    break;
                    case 3:
                        result += this._charMap[Boulderdash.BOULDER]
                    break;
                    case 4:
                        result += this._charMap[Boulderdash.BUTTERFLY]
                    break;
                    case 5:
                        result += this._charMap[Boulderdash.CRAB]
                    break;
                    case 6:
                        result += this._charMap[Boulderdash.EMPTY]
                    break;
                    case 7:
                        result += this._charMap[Boulderdash.AVATAR]
                    break;
                    case 8:
                        result += this._charMap[Boulderdash.EXIT]
                    break;
                }
            }
            result+= "\n";
        }
        return result;
    }
}
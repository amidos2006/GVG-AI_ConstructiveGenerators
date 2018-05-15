class CellularAutomata{
    private _solidFlipNum:number;
    private _emptyFlipNum:number;
    private _tinySolidNum:number;

    constructor(solidFlipNum:number, emptyFlipNum:number, tinySolidNum:number){
        this._solidFlipNum = solidFlipNum;
        this._emptyFlipNum = emptyFlipNum;
        this._tinySolidNum = tinySolidNum;
    }

    private checkNumSolid(map:number[][], p:any, four:boolean = false){
        let value: number = 0;
        for(let y:number=-1; y<=1; y++){
            for(let x:number=-1; x<=1; x++){
                if (x == 0 && y == 0) {
                    continue;
                }
                if(map[p.y+y][p.x+x] == 1){
                    if(four){
                        if(x == 0 || y == 0){
                            value += 1;
                        }
                    }
                    else{
                        value += 1;
                    }
                }
            }
        }
        return value;
    }

    private getUnlabeledLocation(map:number[][]):any{
        for (let y: number = 1; y < map.length - 1; y++) {
            for (let x: number = 1; x < map[y].length - 1; x++) {
                if(map[y][x] == 0){
                    return {x:x, y:y};
                }
            }
        }
        return null;
    }

    private labelMap(map:number[][], start:any, label:number):any[]{
        let result:any[] = [];
        let locations:any[] = [start];
        while(locations.length > 0){
            let current:any = locations.splice(0, 1)[0];
            if(map[current.y][current.x] == 0){
                result.push(current);
                map[current.y][current.x] = label;
                for(let y:number=-1; y<=1; y++){
                    for(let x:number=-1; x<=1; x++){
                        if((y==0 || x==0) && !(y==0 && x==0)){
                            locations.push({x:current.x+x, y:current.y+y});
                        }
                    }
                }
            }
        }
        return result;
    }

    private getEmptyRegions(map:number[][]):any[][]{
        let regions:any[][] = [];
        let start:any = this.getUnlabeledLocation(map);
        let label:number = 2;
        while(start != null){
            regions.push(this.labelMap(map, start, label));
            label += 1;
            start = this.getUnlabeledLocation(map);
        }
        return regions;
    }

    private checkNumEmpty(map:number[][], p:any, four:boolean = false){
        return 8 - this.checkNumSolid(map, p, four);
    }

    private tinySolid(map:number[][]):boolean{
        for(let y:number=1; y<map.length-1; y++){
            for(let x:number=1; x<map[y].length-1; x++){
                if(map[y][x] == 1 && this.checkNumSolid(map, {x:x, y:y}, true) <= this._tinySolidNum){
                    return true;
                }
            }
        }
        return false;
    }

    private connect(map:number[][], p1:any, p2:any):void{
        let dx:number = Math.sign(p2.x - p1.x);
        let dy:number = Math.sign(p2.y - p1.y);
        let x: number = p1.x;
        while (x != p2.x) {
            map[p1.y][x] = 0;
            x += dx;
        }
        let y: number = p1.y;
        while (y != p2.y) {
            map[y][p2.x] = 0;
            y += dy;
        }
    }

    private clone(map:number[][]):number[][]{
        let result:number[][] = [];
        for (let y: number = 0; y < map.length; y++) {
            result.push([]);
            for (let x: number = 0; x < map[y].length; x++) {
                if(map[y][x] == 1){
                    result[y].push(1);
                }
                else{
                    result[y].push(0);
                }
            }
        }
        return result;
    }

    generate(width:number, height:number, solidPercentage:number, iterations:number):number[][]{
        let result:number[][] = [];
        for(let y:number=0; y<height; y++){
            result.push([]);
            for(let x:number=0; x<width; x++){
                if(Math.random() < solidPercentage || 
                    (y == 0 || x == 0 || y == height - 1 || x == width - 1)){
                    result[y].push(1);
                }
                else{
                    result[y].push(0);
                }
            }
        }
        let i:number = 0;
        while((this.tinySolid(result) && this._tinySolidNum >= 0) || i <iterations){
            let newMap:number[][] = this.clone(result);
            for (let y: number = 1; y < result.length - 1; y++) {
                for (let x: number = 1; x < result[y].length - 1; x++) {
                    if(result[y][x] == 0){
                        if(this.checkNumSolid(result, {x:x, y:y}) > this._solidFlipNum){
                            newMap[y][x] = 1;
                        }
                    }
                    else{
                        if (this.checkNumEmpty(result, { x: x, y: y }) > this._emptyFlipNum) {
                            newMap[y][x] = 0;
                        }
                    }
                }
            }
            result = newMap;
            i++;
        }
        let regions:any[][] = this.getEmptyRegions(this.clone(result));
        for(let r1 of regions){
            for(let r2 of regions){
                let p1:any = r1[Math.floor(Math.random() * r1.length)];
                let p2:any = r2[Math.floor(Math.random() * r2.length)];
                this.connect(result, p1, p2);
            }
        }
        return result;
    }
}
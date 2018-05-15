class ZenPuzzle{
    static readonly AVATAR:string = "avatar";
    static readonly ROCK:string = "rock";
    static readonly TILE:string = "tile";
    static readonly EMPTY:string = "empty";

    private _hilbert2D:any;
    private _charMap:any;

    constructor(hilbert2D:any, charMap:any){
        this._hilbert2D = hilbert2D;
        this._charMap = charMap;
    }

    private sign(value: number): number {
        if (value > 0) {
            return 1;
        }
        if (value < 0) {
            return -1;
        }
        return 0;
    }

    private putZeroes(map:number[][], start:any, end:any):void{
        if((start.x > map[0].length - 1 || start.y > map.length - 1) && 
            (end.x > map[0].length - 1 || end.y > map.length - 1)){
            return;
        }
        if (start.x > map[0].length - 1 || start.y > map.length - 1){
            let temp:any = start;
            start = end;
            end = temp;
        }
        if(Math.abs(start.x - end.x) == 2 && start.y - end.y == 0){
            let dx:number = this.sign(end.x-start.x);
            map[start.y][start.x] = 0;
            map[start.y][Math.min(start.x + dx, map[0].length-1)] = 0;
            map[start.y][Math.min(start.x + 2*dx, map[0].length-1)] = 0;
        }
        if (Math.abs(start.y - end.y) == 2 && start.x - end.x == 0) {
            let dy: number = this.sign(end.y-start.y);
            map[start.y][start.x] = 0;
            map[Math.min(map.length-1, start.y + dy)][start.x] = 0;
            map[Math.min(map.length-1, start.y + 2 * dy)][start.x] = 0;
        }
    }

    private appendEmpty(rows:number, columns:number):string{
        let lines:string = "";
        for(let i:number=0; i<rows; i++){
            for(let j:number=0; j<columns; j++){
                lines += this._charMap[ZenPuzzle.EMPTY];
            }
            lines += "\n";
        }
        return lines;
    }

    getDifficultyParameters(diff: number, maxWidth:number, maxHeight:number): number[] {
        let width:number = Math.floor(Math.max(0, maxWidth - 10) * diff + 2 * Math.random()) + 2;
        let height: number = Math.floor(Math.max(0, maxHeight - 8) * diff + 2 * Math.random()) + 2;
        let borderX: number = (0.3 * diff + 0.4 * Math.random() + 0.3);
        let borderY: number = (0.3 * diff + 0.4 * Math.random() + 0.3);
        return [width, height, borderX, borderY];
    }

    adjustParameters(width: number, height: number, borderX: number = 0, borderY: number = 0): number[]{
        let parameters:number[] = [borderX, borderY];
        parameters[0] = 2 * Math.floor(borderX * width/4);
        parameters[1] = 2 * Math.floor(borderY * height/4);
        return [Math.max(width, 2), Math.max(height, 2)].concat(parameters);
    }

    generate(boardWidth:number, boardHeight:number, borderX:number=0, borderY:number=0):string{
        let curveSize:number = Math.pow(2, Math.ceil(Math.max(Math.log2(boardWidth), Math.log2(boardHeight))));
        let h2d:any = new this._hilbert2D(curveSize);
        let start:any = {
            x: Math.floor(Math.random() * (curveSize - boardWidth / 2)),
            y: Math.floor(Math.random() * (curveSize - boardHeight / 2))
        };
        let end:any = {
            x:start.x + Math.floor(boardWidth/2) + 2,
            y:start.y + Math.floor(boardHeight/2) + 2
        }
        let points:any[]= [];
        for(let i:number=0; i<curveSize*curveSize; i++){
            let p:any = h2d.xy(i);
            if(p.x >= start.x && p.x < end.x && p.y >= start.y && p.y < end.y){
                points.push({x:2 * (p.x-start.x), y:2 * (p.y-start.y)});
            }
        }
        let results:number[][] = [];
        for(let y:number=0; y<boardHeight; y++){
            results.push([]);
            for (let x: number = 0; x < boardWidth; x++) {
                if (x >= borderX && y >= borderY && 
                    x <= boardWidth - borderX - 1 && y <= boardHeight - borderY - 1){
                    results[y].push(1);
                }
                else{
                    results[y].push(0);
                }
            }
        }
        for(let i:number=0; i<points.length; i++){
            if(i < points.length - 1){
                this.putZeroes(results, points[i], points[i+1]);
            }
        }

        let levelString:string = this.appendEmpty(2, results[0].length + 6);
        for(let y:number=0; y<results.length; y++){
            levelString += this._charMap[ZenPuzzle.EMPTY];
            if(y == Math.floor(results.length/2)){
                levelString += this._charMap[ZenPuzzle.AVATAR];
            }
            else{
                levelString += this._charMap[ZenPuzzle.EMPTY];
            }
            levelString += this._charMap[ZenPuzzle.EMPTY];
            for(let x:number=0; x<results[y].length; x++){
                if(results[y][x] == 0){
                    levelString += this._charMap[ZenPuzzle.TILE];
                }
                else{
                    levelString += this._charMap[ZenPuzzle.ROCK];
                }
            }
            levelString += this._charMap[ZenPuzzle.EMPTY] + this._charMap[ZenPuzzle.EMPTY] + 
                this._charMap[ZenPuzzle.EMPTY] + "\n";
        }
        levelString += this.appendEmpty(2, results[0].length + 6);
        levelString = levelString.substr(0, levelString.length - 1);
        return levelString;
    }
}
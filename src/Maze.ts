class Cell{
    private _walls:boolean[];
    marked:boolean;

    constructor(){
        this._walls = [true, true, true, true];
        this.marked = false;
    }

    unlockDirection(dir:any):void{
        if(dir.x == -1){
            this._walls[0] = false;
        }
        if(dir.x == 1){
            this._walls[1] = false;
        }
        if(dir.y == -1){
            this._walls[2] = false;
        }
        if(dir.y == 1){
            this._walls[3] = false;
        }
    }

    getWall(dir:any):boolean{
        if (dir.x == -1) {
            return this._walls[0];
        }
        if (dir.x == 1) {
            return this._walls[1];
        }
        if (dir.y == -1) {
            return this._walls[2];
        }
        if (dir.y == 1) {
            return this._walls[3];
        }
        return true;
    }
}

class Maze{
    constructor(){

    }

    generate(width:number, height:number):number[][]{
        let maze:Cell[][] = [];
        for(let y:number=0; y<height; y++){
            maze.push([]);
            for(let x:number=0; x<width; x++){
                maze[y].push(new Cell());
            }
        }
        let start:any = {x: Math.floor(Math.random()*width), y: Math.floor(Math.random()*height)};
        let open:Cell[] = [start];
        while(open.length > 0){
            open.sort((a,b)=>{return 2 * Math.random() - 1;})
            let current:any = open.splice(0, 1)[0];
            if(!maze[current.y][current.x].marked){
                let surrounding:any[] = [];
                for (let x: number = -1; x <= 1; x++) {
                    for (let y: number = -1; y <= 1; y++) {
                        if ((x == 0 || y == 0) && !(x == 0 && y == 0)) {
                            let newPos: any = { x: current.x + x, y: current.y + y };
                            if (newPos.x >= 0 && newPos.y >= 0 && newPos.x <= width - 1 && newPos.y <= height - 1) {
                                if(maze[newPos.y][newPos.x].marked){
                                    surrounding.push({x:x, y:y});
                                }
                            }
                        }
                    }
                }
                surrounding.sort((a,b)=>{return Math.random() - 0.5;});
                if(surrounding.length > 0){
                    maze[current.y][current.x].unlockDirection(surrounding[0]);
                    maze[current.y+surrounding[0].y][current.x+surrounding[0].x].unlockDirection(
                        {x:-1 * surrounding[0].x,y:-1 * surrounding[0].y});
                }
                maze[current.y][current.x].marked = true;
                for(let x:number=-1; x<=1; x++){
                    for(let y:number=-1;y<=1;y++){
                        if((x==0 || y==0) && !(x==0 && y==0)){
                            let newPos:any = {x:current.x+x, y:current.y+y};
                            if(newPos.x >= 0 && newPos.y >=0 && newPos.x <= width-1 && newPos.y <= height-1){
                                open.push(newPos);
                            }
                        }
                    }
                }
            }
        }
        
        let result:number[][] = [];
        for(let y:number=0; y<2*height+1; y++){
            result.push([]);
            for(let x:number=0; x<2*width+1; x++){
                result[y].push(1);
            }
        }
        for(let y:number=0; y<result.length; y++){
            for(let x:number=0; x<result[y].length; x++){
                if(y%2 == 1 && x %2 == 1){
                    let pos:any = {x:Math.floor(x/2), y:Math.floor(y/2)};
                    result[y][x] = 0;
                    if(!maze[pos.y][pos.x].getWall({x:-1, y:0})){
                        result[y][x - 1] = 0;
                    }
                    if (!maze[pos.y][pos.x].getWall({ x: 1, y: 0 })) {
                        result[y][x + 1] = 0;
                    }
                    if (!maze[pos.y][pos.x].getWall({ x: 0, y: -1 })) {
                        result[y - 1][x] = 0;
                    }
                    if (!maze[pos.y][pos.x].getWall({ x: 0, y: 1 })) {
                        result[y + 1][x] = 0;
                    }
                }
            }
        }
        return result;
    }
}
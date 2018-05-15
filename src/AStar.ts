class AStar{
    private _empty:number[];

    constructor(empty:number[]){
        this._empty = empty;
    }

    private insideMap(map:number[][], p:any):boolean{
        return p.x >= 0 && p.y >= 0 && p.x <= map[0].length - 1 && p.y <= map.length - 1;
    }

    private passable(map:number[][], p:any):boolean{
        return this._empty.indexOf(map[p.y][p.x]) != -1;
    }

    pathExisits(map:number[][], start:any, end:any):boolean{
        if(!this.insideMap(map, start) || !this.insideMap(map, end) || 
            !this.passable(map, start) || !this.passable(map, end)){
            return false;
        }
        let visited:Object = {};
        let queue:any[] = [{x:start.x, y:start.y}];
        while(queue.length > 0){
            queue.sort((a, b)=>{
                let dist1: number = Math.abs(a.x - end.x) + Math.abs(a.y - end.y);
                let dist2: number = Math.abs(b.x - end.x) + Math.abs(b.y - end.y);
                return dist1 - dist2;
            });
            let currentNode:any = queue.splice(0, 1)[0];
            if(currentNode.x == end.x && currentNode.y == end.y){
                return true;
            }
            if(!visited.hasOwnProperty(currentNode.x + "," + currentNode.y)){
                visited[currentNode.x + "," + currentNode.y] = true;
                for(let dx:number=-1; dx<=1; dx++){
                    for(let dy:number=-1; dy<=1; dy++){
                        if((dx == 0 || dy == 0) && !(dx == 0 && dy == 0) && 
                            this.insideMap(map, {x:currentNode.x+dx, y:currentNode.y+dy})&&
                            this.passable(map, {x:currentNode.x+dx, y:currentNode.y+dy})){
                            queue.push({x:currentNode.x+dx, y:currentNode.y+dy});
                        }
                    }
                }
            }
        }
        return false;
    }
}
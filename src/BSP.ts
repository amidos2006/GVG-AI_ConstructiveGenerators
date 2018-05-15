class Region {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getVerticalSplit(minWidth: number): Region[] {
        if (this.width < 2 * minWidth) {
            return [this];
        }
        let split: number = minWidth + Math.floor(Math.random() * (this.width - 2 * minWidth));
        return [
            new Region(this.x, this.y, split, this.height),
            new Region(this.x + split, this.y, this.width - split, this.height)
        ];
    }

    getHorizontalSplit(minHeight: number): Region[] {
        if (this.height < 2 * minHeight) {
            return [this];
        }
        let split: number = minHeight + Math.floor(Math.random() * (this.height - 2 * minHeight));
        return [
            new Region(this.x, this.y, this.width, split),
            new Region(this.x, this.y + split, this.width, this.height - split)
        ];
    }
}

class BSP {
    private _roomWidth: number;
    private _roomHeight: number;
    private _width: number;
    private _height: number;

    constructor(roomWidth:number, roomHeight:number) {
        this._roomWidth = roomWidth;
        this._roomHeight = roomHeight;
    }

    private shuffleArray(array: any[]): void {
        for (let i: number = 0; i < array.length; i++) {
            let index: number = Math.floor(Math.random() * array.length);
            let temp: number = array[index];
            array[index] = array[i];
            array[i] = temp;
        }
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

    private connect(map: number[][], p1: any, p2: any): void {
        let dx: number = Math.sign(p2.x - p1.x);
        let dy: number = Math.sign(p2.y - p1.y);
        if(Math.random()<0.5){
            let x:number = p1.x;
            while(x != p2.x){
                map[p1.y][x] = 0;
                x+=dx;
            }
            let y: number = p1.y;
            while (y != p2.y) {
                map[y][p2.x] = 0;
                y += dy;
            }
        }
        else{
            let y: number = p1.y;
            while (y != p2.y) {
                map[y][p2.x] = 0;
                y += dy;
            }
            let x: number = p1.x;
            while (x != p2.x) {
                map[p1.y][x] = 0;
                x += dx;
            }
        }
    }

    generate(width:number, height:number, rooms: number): number[][] {
        this._width = width;
        this._height = height;
        
        let iterations:number = 0;
        let allRooms: Region[] = [new Region(0, 0, this._width, this._height)];
        while (allRooms.length < rooms) {
            this.shuffleArray(allRooms);
            let before: number = allRooms.length;
            let currentRoom: Region = allRooms.splice(0, 1)[0];
            let newRooms: Region[] = currentRoom.getHorizontalSplit(this._roomHeight);
            if (Math.random() < 0.5 || newRooms.length == 1) {
                newRooms = currentRoom.getVerticalSplit(this._roomWidth);
            }
            allRooms = allRooms.concat(newRooms);
            let after:number = allRooms.length;
            if(before != after){
                iterations = 0;
            }
            else{
                iterations += 1;
                if(iterations >= 100){
                    break;
                }
            }
        }
        let result: number[][] = [];
        for (let y: number = 0; y < this._height; y++) {
            result.push([]);
            for (let x: number = 0; x < this._width; x++) {
                result[y].push(1);
            }
        }
        for (let r of allRooms) {
            for (let y: number = 0; y < r.height - 1; y++) {
                for (let x: number = 0; x < r.width - 1; x++) {
                    let cx: number = Math.max(r.x + x, 1);
                    let cy: number = Math.max(r.y + y, 1);
                    result[cy][cx] = 0;
                }
            }
        }
        let centers:any[] = [];
        for(let i:number=0; i<allRooms.length; i++){
            for(let j:number=i+1; j<allRooms.length; j++){
                let r1 = allRooms[i];
                let r2 = allRooms[j];
                let c1:any = {
                    x: r1.x + Math.floor(r1.width / 2),
                    y: r1.y + Math.floor(r1.height / 2)
                }
                let c2:any = {
                    x: r2.x + Math.floor(r2.width / 2),
                    y: r2.y + Math.floor(r2.height / 2)
                }
                centers.push({
                    c1: c1, c2: c2, 
                    dim: Math.sign(Math.abs(c1.x - c2.x)) +  Math.sign((Math.abs(c1.y - c2.y)))
                });
            }
        }
        centers.sort((a,b)=>{return a.dim - b.dim + 0.1 * (2 * Math.random() - 1)});
        
        for (let i: number = 0; i < Math.min(allRooms.length + 1, centers.length); i++) {
            let start: any = centers[i].c1;
            let end: any = centers[i].c2;
            this.connect(result, start, end);
        }
        return result;
    }
}
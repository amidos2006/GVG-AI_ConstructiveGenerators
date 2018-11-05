class Solarfox{
    static readonly TOP_ENEMY: string = "top";
    static readonly BOT_ENEMY: string = "bot";
    static readonly PLAYER: string = "player";
    static readonly PILL: string = "pill";
    static readonly POWER_PILL: string = "powerpill";
    static readonly WALL: string = "wall";
    static readonly EMPTY: string = "empty";
    static readonly EMPTY_BORDER: string = "emptyBorder";

    private _charMap: any;

    constructor(charMap:any){
        this._charMap = charMap;
    }

    getDifficultyParameters(diff: number, maxWidth: number, maxHeight: number): number[] {
        // let width: number = Math.floor(diff * Math.max(maxWidth - 6, 0) + 2 * Math.random()) + 4;
        let width: number = maxWidth;
        // let height: number = Math.floor(diff * Math.max(maxHeight - 6, 0) + 2 * Math.random()) + 4;
        let height: number = maxHeight;
        let pillNumber: number = diff * 0.8 + 0.1 * Math.random() + 0.1;
        let pillConcentrate:number = diff * 0.4 + 0.2 * Math.random() + 0.4;
        let enemyStarting:number = (1 - diff) * 0.5 + 0.5;
        let enemyEnding:number = (1 - diff) * 0.3 + 0.5;
        return [width, height, pillNumber, pillConcentrate, enemyStarting, enemyEnding];
    }

    adjustParameters(width: number, height: number, pillNumber: number, pillConcentrate:number, enemyStarting:number, enemyEnding:number): number[] {
        let parameters: number[] = [pillNumber, pillConcentrate, enemyStarting, enemyEnding];
        parameters[0] = Math.floor(pillNumber * 0.7 * (width - 2) * (height - 2));
        parameters[1] = pillConcentrate;
        parameters[2] = Math.floor(enemyStarting * (width - 2) / 2);
        parameters[3] = Math.floor(enemyEnding * (width - 2) / 2);
        return [Math.max(width, 4), Math.max(height, 4)].concat(parameters);
    }

    private getJewel(type:number):number{
        if(type == 0 || (type == 2 && Math.random() < 0.5)){
            return 1;
        }
        return 2;
    }

    private reflectHorizontal(map:number[][]):void{
        for (let y: number = 0; y < map.length; y++) {
            for (let x: number = 0; x < Math.floor(map[y].length / 2); x++) {
                if(map[y][x] != 0){
                    map[y][map[y].length - x - 1] = map[y][x];
                }
            }
        }
    }

    private reflectVertical(map:number[][]):void{
        for (let y: number = 0; y < Math.floor(map.length / 2); y++) {
            for (let x: number = 0; x < map[y].length; x++) {
                if (map[y][x] != 0) {
                    map[map.length - y - 1][x] = map[y][x];
                }
            }
        }
    }

    generate(width: number, height: number, pillNumber: number, pillConcentrate:number, enemyStarting:number, enemyEnding:number): string {
        let map:number[][] = [];
        for(let y:number=0; y<height; y++){
            map.push([]);
            for(let x:number = 0; x<width; x++){
                map[y].push(0);
            }
        }
        let player = { x: Math.floor(width/2 + 2 * Math.random() - 1), y: Math.floor(height/ 2 + 2 * Math.random() - 1)};
        let topEnemy:number = Math.floor(2 * Math.random() ) * Math.floor(Math.random() * (enemyStarting - enemyEnding) + enemyEnding);
        if(Math.random() < 0.5){
            topEnemy *= -1;
        }
        let botEnemy:number = Math.floor(Math.random() * (enemyStarting - enemyEnding) + enemyEnding);
        if(Math.random() < 0.5){
            botEnemy *= -1;
        }
        if(Math.random() < 0.8){
            if(Math.random() < 0.8){
                botEnemy = -topEnemy;
            }
            else{
                botEnemy = -Math.abs(botEnemy) * Math.sign(topEnemy);
            }
        }
        let jewelType = Math.floor(Math.random() * 3);
        let similarityType = Math.floor(Math.random() * 3);
        let pillConcentrateWidth = Math.floor(width / 2 - pillConcentrate * width / 2);
        let pillConcentrateHeight = Math.floor(height / 2 - pillConcentrate * height / 2);
        switch(similarityType){
            case 0:
                for(let i=0; i<pillNumber / 2; i++){
                    let p = {
                        x: Math.floor(Math.random() * (width - 2 - 2 * pillConcentrateWidth) / 2) + 1 + pillConcentrateWidth,
                        y: Math.floor(Math.random() * (height - 2 - 2 * pillConcentrateHeight)) + 1 + pillConcentrateHeight
                    }
                    map[p.y][p.x] = this.getJewel(jewelType);
                }
                this.reflectHorizontal(map);
            break;
            case 1:
                for (let i = 0; i < pillNumber / 2; i++) {
                    let p = {
                        x: Math.floor(Math.random() * (width - 2 - 2 * pillConcentrateWidth)) + 1 + pillConcentrateWidth,
                        y: Math.floor(Math.random() * (height - 2 - 2 * pillConcentrateHeight) / 2) + 1 + pillConcentrateHeight
                    }
                    map[p.y][p.x] = this.getJewel(jewelType);
                }
                this.reflectVertical(map);
            break;
            case 2:
                for (let i = 0; i < pillNumber / 4; i++) {
                    let p = {
                        x: Math.floor(Math.random() * (width - 2 - 2 * pillConcentrateWidth) / 2) + 1 + pillConcentrateWidth,
                        y: Math.floor(Math.random() * (height - 2 - 2 * pillConcentrateHeight) / 2) + 1 + pillConcentrateHeight
                    }
                    map[p.y][p.x] = this.getJewel(jewelType);
                }
                this.reflectHorizontal(map);
                this.reflectVertical(map);
            break;
        }
        map[player.y][player.x] = 3;
        map[0][Math.floor(width / 2) + topEnemy] = 4;
        map[map.length - 1][Math.floor(width / 2) + botEnemy] = 4;
        for(let i=0; i<map.length; i++){
            map[i][0] = 5;
            map[i][map[i].length - 1] = 5;
        }
        let result = "";
        for (let y: number = 0; y < map.length; y++) {
            for (let x: number = 0; x < map[y].length; x++) {
                switch(map[y][x]){
                    case 0:
                        if(y == 0 || y == map.length - 1){
                            result += this._charMap[Solarfox.EMPTY_BORDER];
                        }
                        else{
                            result += this._charMap[Solarfox.EMPTY];
                        }
                    break;
                    case 1:
                        result += this._charMap[Solarfox.PILL];
                    break;
                    case 2:
                        result += this._charMap[Solarfox.POWER_PILL];
                    break;
                    case 3:
                        result += this._charMap[Solarfox.PLAYER];
                    break;
                    case 4:
                        if(y == 0){
                            result += this._charMap[Solarfox.TOP_ENEMY];
                        }
                        else{
                            result += this._charMap[Solarfox.BOT_ENEMY];
                        }
                    break;
                    case 5:
                        result += this._charMap[Solarfox.WALL];
                    break;
                }
            }
            result += "\n";
        }
        return result;
    }
}
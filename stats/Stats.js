function product_Range(a, b) {
    var prd = a, i = a;

    while (i++ < b) {
        prd *= i;
    }
    return prd;
}
function combinations(n, r) {
    if (n == r) {
        return 1;
    }
    else {
        r = (r < n - r) ? n - r : r;
        return product_Range(r + 1, n) / product_Range(1, n - r);
    }
}

function zelda(diff, random, maxWidth, maxHeight){
    let width = Math.floor(diff * Math.max(maxWidth - 6, 0) + 2 * random) + 4;
    let height = Math.floor(diff * Math.max(maxHeight - 6, 0) + 2 * random) + 4;
    let openess = (1 - diff) * 0.4 + 0.1 * random;
    let enemies = diff * 0.5 + 0.1 * random + 0.4;
    openess = Math.floor(openess * (width - 1) * (height - 1));
    enemies = Math.floor(enemies * 0.05 * width * height);
    return [width, height, openess, enemies];
}

function boulderdash(diff, random, maxWidth, maxHeight){

}

function frogs(diff, random, maxWidth, maxHeight){
    let width = Math.floor((maxWidth - 11) * diff + 3 * random) + 6;
    let height = Math.floor((maxHeight - 9) * diff + 3 * random) + 4;
    let streetPercentage = (1 + 0.5 * random) * diff;
    let waterPercentage = (2 + random) * diff;
    let safetyPercentage = 1 - diff;
    if(streetPercentage == 0){
        streetPercentage = 1;
        waterPercentage = 1;
        safetyPercentage = 1;
    }
    let cars = Math.floor(random * 0.4 * width) + 2;
    let logs = Math.floor(random * 0.2 * width) + 1;
    width += 2;
    let temp = [0, 0, 0];
    temp[0] = streetPercentage / (streetPercentage + waterPercentage + safetyPercentage);
    temp[1] = waterPercentage / (streetPercentage + waterPercentage + safetyPercentage);
    temp[2] = safetyPercentage / (streetPercentage + waterPercentage + safetyPercentage);
    streetPercentage = temp[0];
    waterPercentage = temp[1];
    safetyPercentage = temp[2];
    return [width, height, streetPercentage, waterPercentage, cars, logs];
}

function boulderdash(diff, random, maxWidth, maxHeight){
    let width = Math.floor((maxWidth - 12) * diff + 2 * random) + 10;
    let height = Math.floor((maxHeight - 12) * diff + 2 * random) + 10;
    let solidPercentage = 0.6 * diff + 0.2 + 0.2 * random;
    let smoothness = 0.5 * (1 - diff) + 0.3 + 0.2 * random;
    let enemies = (0.7 + 0.3 * random) * diff;
    let boulders = (0.7 + 0.3 * random) * diff;
    let extraGems = 0.7 * (1 - diff) + 0.1 + 0.2 * random;
    solidPercentage = solidPercentage * 0.5;
    smoothness = Math.floor(smoothness * 10 + 1);
    enemies = Math.floor(enemies * 0.05 * width * height);
    extraGems = Math.floor(extraGems * 0.05 * width * height);
    boulders = Math.floor(boulders * 2 * (10 + extraGems));
    return [width, height, solidPercentage, smoothness, enemies, boulders, extraGems];
}

for(let i=0; i<1; i+=0.1){
    let min = zelda(i, 0, 13, 9);
    console.log("Zelda Diff_" + i.toFixed(1) + " Random_0: " + min);
    let max = zelda(i, 1, 13, 9)
    console.log("Zelda Diff_" + i.toFixed(1) + " Random_1: " + max);
    let complexity = 0;
    for(let width=min[0]; width<max[0]; width++){
        for(let height=min[1]; height<max[1]; height++){
            let area = (width - 1) * (height - 1);
            let solidArea = Math.floor(area / 2);
            for(let openess=min[2]; openess<=max[2]; openess++){
                let openArea = area - solidArea + openess;
                for(let enemies=min[3]; enemies<=max[3]; enemies++){
                    complexity += combinations(area, openArea) * openArea * (openArea - 1) * (openArea - 2) * combinations(openArea - 3, enemies);
                }
            }
        }
    }
    console.log("Minimum: " + complexity.toExponential(2));
}

console.log("\n\n\n");

for (let i = 0; i < 1; i += 0.1) {
    let min = frogs(i, 0, 28, 11);
    console.log("Frogs Diff_" + i.toFixed(1) + " Random_0: " + min);
    let max = frogs(i, 1, 28, 11)
    console.log("Frogs Diff_" + i.toFixed(1) + " Random_1: " + max);
    let complexity = 0;
    for (let height = min[1]; height < max[1]; height++) {
        let minWater = min[3] * height;
        let minStreet = min[2] * height;
        let maxWater = max[3] * height;
        let maxStreet = max[2] * height;
        for (let water = minWater; water <= maxWater; water++) {
            for (let street = minStreet; street <= maxStreet; street++) {
                let levels = 0;
                for(let width=min[0]; width<max[0]; width++){
                    levels += combinations(height, water);
                    levels += combinations(height - water, street);
                    for(let cars=min[4]; cars<max[4]; cars++){
                        for (let logs = min[5]; logs < max[5]; logs++) {
                            complexity += Math.floor(levels * (width - 2) * (width - 2) * street * combinations(width - 2, cars) * water * combinations(width - 2, logs));
                        }
                    }
                }
            }
        }
        
    }
    console.log("Minimum: " + complexity.toExponential(2));
}

console.log("\n\n\n");

for (let i = 0; i < 1; i += 0.1) {
    let min = boulderdash(i, 0, 26, 13);
    console.log("Boulderdash Diff_" + i.toFixed(1) + " Random_0: " + min);
    let max = boulderdash(i, 1, 26, 13)
    console.log("Boulderdash Diff_" + i.toFixed(1) + " Random_1: " + max);
    let complexity = 0;
    for (let width = min[0]; width < max[0]; width++) {
        for (let height = min[1]; height < max[1]; height++) {
            let area = (width - 1) * (height - 1);
            for(let solid=min[2]*area; solid<max[2]*area; solid++){
                let openArea = area - solid;
                complexity += combinations(area, openArea) * openArea;
            }
        }
    }
    console.log("Minimum: " + complexity.toExponential(2));
}
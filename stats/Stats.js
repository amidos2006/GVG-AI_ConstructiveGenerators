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
            for(let openess=min[2]; openess<max[2]; openess++){
                let openArea = area - solidArea + openess;
                complexity += combinations(area, openArea) * openArea;
            }
        }
    }
    console.log("Minimum: " + complexity);
}
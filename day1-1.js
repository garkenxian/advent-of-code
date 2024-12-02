const fs = require("fs");

const show_progress = (process.env.SHOW_PROGRESS && process.env.SHOW_PROGRESS == "true") || true,
      data        = "./data/day1-full.txt";

let showProgress = msg => {
    if (show_progress) {
        console.log(msg);
    }
}

let getArrays = (data) => {
    let arr1 = [],
        arr2 = [];

    data.split("\n").forEach(line => {
        const [left, right] = line.trim().split("   ");

        showProgress(`Pushing left: ${left} | right: ${right}`);
        arr1.push(parseInt(left,10));
        arr2.push(parseInt(right, 10));
    });

    return [arr1, arr2];
}

let doChallenge = (arr1, arr2) => {

    arr1.sort((a,b) => a - b);
    arr2.sort((a,b) => a - b);

    let total = 0;

    for(let a = 0; a < arr1.length; a++){
        let dist = Math.abs(arr2[a] - arr1[a]);
        showProgress(`Comparing ${arr2[a]} and ${arr1[a]}: Distance is ${dist}`);
        total += dist;
    }

    console.log(total);
}

fs.readFile(data, "utf8", (err, data) => {
    if (err) {
        console.error ("Error reading the file:", err);
    }

    let [arr1, arr2] = getArrays(data);

    doChallenge(arr1, arr2);

});


const fs = require("fs");

const show_progress = (process.env.SHOW_PROGRESS && process.env.SHOW_PROGRESS == "true") || true,
      data          = "./data/day1-full.txt";

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
    // calculate simularity score
    let total = 0;

    arr1.forEach(i => {
        let startIndex = 0;
        let index = arr2.indexOf(i, startIndex);
        let counter = 0;

        //showProgress(`looking for ${i}`);

        while(index >= 0){
            //showProgress(`Current State: Index ${index} | Counter = ${counter}`);
            counter++;
            startIndex = index + 1;
            index = arr2.indexOf(i, startIndex);
        }

        showProgress(`Found ${counter} instances of ${i}`);

        total += i * counter
    });

    console.log(total);

}

fs.readFile(data, "utf8", (err, data) => {
    if (err) {
        console.error ("Error reading the file:", err);
    }

    let [arr1, arr2] = getArrays(data);

    doChallenge(arr1, arr2);

});


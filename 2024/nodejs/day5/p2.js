Error.stackTraceLimit = Infinity;

const fs = require("fs");
const fn = `${__dirname}/data/full.txt`;

let rules       = [],
    updates     = [];

let getMap = data => {
    let updateMap = line => {
        rules.push(line.trim());
    }

    let updateUpdate = line => {
        let arr = [];

        line.split(",").forEach(l => {
            arr.push(parseInt(l.trim(),10));
        });

        let obj = {
            update : arr,
            isValid : false,
            fixed : []
        }

        updates.push(obj);
    }

    let func = updateMap;
    data.split("\n").forEach(line => {
        //console.log(`Processing line ${line}`);

        if (line.trim() === ""){
            //console.log("Switching to updateUpdates function");
            func = updateUpdate;
        } else {
            func(line);
        }
    }); 
}

let updateComparison = (left, right) => {
    let validArray   = `${left}|${right}`,
        invalidArray = `${right}|${left}`;

    // is valid if the rules contain the valid array, or the rules does not contain the valid array, or neither

    // its valid just return true
    if (rules.indexOf(validArray) >= 0){
        return true;
    }

    // wait.. its specifically in the invalid list
    if (rules.indexOf(invalidArray) >= 0){
        return false;
    }

    // not in either
    return true;
}

let isUpdateValid = update => {
    let isValid = true;

    let u = [...update];
    let c = u.shift();

    for (let a = 0; a < u.length; a++){
        let ruleCheck = updateComparison(c, u[a]);
        if (!ruleCheck){
            isValid = false;
            break;
        }    
    }

    if (isValid === false || u.length === 1){
        return isValid;
    } else {
        return isUpdateValid(u);
    }
}

let arrayMove = (arr, oldIndex, newIndex) => {
    if (newIndex >= arr.length){
        var k = newIndex - arr.length + 1;
        while(k--){
            arr.push(undefined);
        }
    }

    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
}

let fixUpdates = update => {
    let fixed = [...update];
    let fixApplied = false;
    while(!isUpdateValid(fixed)){
        let i = fixed.length;
        fixApplied = false;
        while (i--){
            let j = -1;
            while (j < i){
                j++;
                //console.log(`[${i},${j}]`);
                if (!updateComparison(fixed[j], fixed[i])){
                    fixed = arrayMove(fixed, i, j)
                    fixApplied = true;
                    break;
                }
            }
    
            if (fixApplied){
                break;
            }
        }
    }

    return fixed;
}

fs.readFile(fn, "utf-8", (err, data) => {
    if (err) {
      console.error ("Error reading the file:", err);
    }

    getMap(data);

    updates.forEach(u => {
        u.isValid = isUpdateValid(u.update);
    });

    updates.filter(u => !u.isValid).forEach(u => {
        // not valid, 
        u.fixed = fixUpdates(u.update);
    });

    let total = 0;
    let limit = updates.filter(u => !u.isValid).length;
    let counter = 0;
    updates.filter(u => !u.isValid).forEach(u => {
        // get the middle value
        counter++;

        console.log(`Fixing Broken Record ${counter} of ${limit}`);

        let mi = Math.floor(u.update.length / 2)
        total += u.fixed[mi];
    });

    //console.log(updates);
    console.log(total);

});
// let fs = require('fs');
// let input = fs.readFileSync('/dev/stdin').toString().split('\n');
// let input = fs.readFileSync('/dev/stdin').toString().split(' ');
// let input = parseInt(fs.readFileSync('/dev/stdin').toString().trim());

// const readline = require("readline");
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// let input = [];

// rl.on("line", function (line) {
//   input.push(parseInt(line));
// }).on("close", function () {

//   process.exit();
// });


/*

*/

// let fs = require('fs')
// let input = fs.readFileSync('/dev/stdin').toString().split(' ')

// const arr = [];
// input.map((word)=>arr.push(parseInt(word)));

// let result = [0,0]

// for (const num in arr) {
//     let index = 0
//     let count = 0
//     for(let i=0; i<arr.length; i++) {
//         if (arr[num] === arr[i]){
//             count += 1;
//             index = i
//         }
//     }
//     if (result[1] <= count && count !== 1) {
//         result[0] = index;
//         result[1] = count
//     }
// }
// const finalIndex = result[0];
// const finalNum = result[1];

// if (finalNum === 3) {
//     console.log(10000+arr[finalIndex]*1000)
// } else if (finalNum === 2) {
//     console.log(1000+arr[finalIndex]*100)
// } else {
//     console.log(Math.max(...arr)*100)
// }



const fs = require("fs");
const arr = fs
    .readFileSync("/dev/stdin")
    .toString()
    .trim()
    .split(" ")
    .map((str) => +str);
// 더하기 연산자를 사용하면 문자타입의 숫자를 숫자타입으로 변경할 수 있다.

const calculateMoney = (arr) => {
    const kindsOfDice = arr.filter((num) => num > 0).length;
    if (kindsOfDice < 3) {
        const max = Math.max(...arr);
        const index = arr.indexOf(max);
        if (kindsOfDice === 2) return 1000 + index * 100;
        if (kindsOfDice === 1) return 10000 + index * 1000;
    } else {
        return Math.max(
            ...arr.map((num, index) => (num > 0 ? index * 100 : 0))
        );
    }
};


const diceCounts = [0, 0, 0, 0, 0, 0, 0];

for (let diceNum = 1; diceNum <= 6; diceNum++) {
    for (let num of arr) {
        diceNum === num && diceCounts[diceNum]++;
    }
}

console.log(calculateMoney(diceCounts));




// const arr = [12, 12, 12, 11];



// const getMode = (arr) => {
//   let mostFrequentCnt = 1;
//   const mode = [];
//   const _map = new Map();

//   for (const item of arr) {
//     const hasValue = _map.get(item);
//     const cnt = hasValue === undefined ? 1: hasValue + 1;
//     _map.set(item, cnt);
//   }
//   console.log(_map)

//   for (const [key, value] of _map) {
//     if (value > mostFrequentCnt) {
//       mostFrequentCnt = value;
//     }
//   }

//   if (mostFrequentCnt === 1) return null;
//   for (const [key, value] of _map) {
//     if (value === mostFrequentCnt) {
//       mode.push(key);
//     }
//   }
//   if (mostFrequentCnt === arr.length) return null;
//   return mode;
// };


// if (getMode(arr)) {
//   console.log('최빈값:', getMode(arr).join(','));
// } else {
//   console.log('없다');
// }
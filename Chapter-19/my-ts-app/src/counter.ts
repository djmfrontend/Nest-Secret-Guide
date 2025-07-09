import { from } from "rxjs";

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
}

// const numbers = [1, 2, 3, 4, 5];

// const numbersTimesTen = numbers.map((number) => number * 10);

// 原生实现map
// Array.prototype.map2 = function (projectFn) {
//   let resultArray = [];
//   // loop through each item
//   this.forEach((item) => {
//     // apply the provided project function
//     let result = projectFn(item);
//     // push the result to our new array
//     resultArray.push(result);
//   });
//   // return the array containing transformed values
//   return resultArray;
// };
const numbers = [1, 2, 3, 4, 5];
const number$ = from(numbers);
// const numbersMultipliedByTen$ = number$.pipe(map((number) => number * 10));

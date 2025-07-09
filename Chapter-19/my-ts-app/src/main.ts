import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";

import { from, map, fromEvent } from "rxjs";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

const numbers = [1, 2, 3, 4, 5];
const number$ = from(numbers);
console.log(number$);
const numbersMultipliedByTen$ = number$.pipe(map((number) => number * 10));
console.log(numbersMultipliedByTen$);
numbersMultipliedByTen$.subscribe(console.log);
console.log(numbers);

// const click$ = fromEvent(document, "click");

// click$.subscribe(() => console.log("click"));

/**
 * 控制一秒钟内最多点击一次
 */

function ClickIn1s() {
  // TODO
  let count = 0;
  let rate = 1000;
  let lastTime = Date.now() - rate;

  document.addEventListener("click", () => {
    // console.log(now, lastTime);
    if (Date.now() - lastTime >= rate) {
      console.log("click");
      lastTime = Date.now();
    }
  });
}
ClickIn1s();

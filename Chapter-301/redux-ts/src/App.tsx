import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store";
import { add, sub } from "./store/slices/count";

function App() {
  const count = useSelector((state: RootState) => state.count.value);
  const dispatch = useDispatch();
  return (
    <>
      <button onClick={() => dispatch(sub(1))}>-1</button>
      <div>{count}</div>
      <button onClick={() => dispatch(add(1))}>+1</button>
    </>
  );
}

export default App;

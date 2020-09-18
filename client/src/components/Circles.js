import React, { useState, useEffect, useRef } from "react";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const generateDataset = () =>
  Array(10)
    .fill(0)
    .map(() => [Math.random() * 80 + 10, Math.random() * 35 + 10]);

const Circles = () => {
  const [dataset, setDataset] = useState([
    [47.53, 42.43],
    [49.48, 31.61],
    [69.7, 44.77],
    [45.71, 17.75],
    [58.11, 11.45],
    [74.39, 37.2],
    [25.89, 10.76],
    [68.1, 34.12],
    [42.44, 12.94],
    [79.93, 16.66],
  ]);
  useInterval(() => {
    const newDataset = generateDataset();
    setDataset(newDataset);
  }, 2000);
  return (
    <div className="text-white w-full h-full flex flex-col border border-green-400">
      <svg width="200" height="200" className="border" viewBox="0 0 100 50">
        {dataset.map(([x, y], i) => (
          <circle cx={x} cy={y} r="5" key={i} fill="white" stroke="white" />
        ))}
      </svg>
    </div>
  );
};

export default Circles;

import React, { useState, useEffect } from "react";
import axios from "axios";

function Chart() {
  const [data, setData] = useState();
  
  useEffect(() => {
    axios.get("/data/dummy.json").then((data) => {
      setData(data);
    })
  }, []);

  const logData = () => {
    console.log(data);
  }

  const hoverHandle = () => {
    console.log("Hover action works")
  }

  return (
    <div className="text-white flex flex-col">
      <button
        onClick={() => logData()}
        className="my-3 py-3 px-5 bg-white text-black rounded font-bold font-mono"
      >
        Log Raw Data
      </button>
      <div className="w-full border">
        <svg width="400" height="400">
          <circle cx="50" cy="50" r="40" fill="#ffa500" onMouseEnter={() => hoverHandle()} />

        </svg>
      </div>
    </div>
  );
};

export default Chart;

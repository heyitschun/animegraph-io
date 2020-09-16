import React, { useState, useEffect } from "react";
import axios from "axios";
import { create, schemeAccent  } from "d3";
import { scaleLinear, scaleOrdinal } from "d3-scale";
//import objectMap from "../helpers/objectMap";

function Chart() {
  const [data, setData] = useState();
  const [genres, setGenres] = useState([]);
  const [chartDims, setChartDims] = useState({ width: 400, height: 400 });
  
  // Data pull
  useEffect(() => {
    axios.get("/data/dummy.json").then((data) => {
      setData(data.data);
      setGenres(Object.keys(data.data));
    });
  }, []);


  // d3 scales
  const xScale = scaleLinear().domain([chartDims.width, chartDims.height])
  const yScale = scaleLinear().domain([chartDims.width, chartDims.height])
  const bubbleGenerator = create("svg");
  var accent = scaleOrdinal(schemeAccent).domain(genres);

  var setDomain = () => {
    accent.domain(genres);
    return accent.domain();
  }
  setDomain();

  let genreFilter;
  let bubblePlot;
  
  // Event handlers
  const logData = () => {
    console.log(data);
  };

  const hoverHandle = () => {
    console.log("Hover action works")
  };

  const plotGenre = (e) => {
    e.preventDefault();
    let animes = data[e.target.innerHTML];
    console.log(animes);
    
  };

  genreFilter = genres.map((g, i) => {
    return (
      <button
        key={i}
        className="py-2 px-5 bg-white text-black my-2 rounded"
        onClick={(e) => plotGenre(e)}
      >
        {g}
      </button>
    )
  });

  return (
    <div className="text-white flex flex-col">
      <button
        onClick={() => logData()}
        className="my-3 py-3 px-5 bg-white text-black rounded font-bold font-mono"
      >
        Log Raw Data
      </button>
      <div className="w-full border">
        <svg width={chartDims.width} height={chartDims.height}>
          <circle cx="50" cy="50" r="40" fill="#ffa500" onMouseEnter={() => hoverHandle()} />
          {bubblePlot}
        </svg>
      </div>
      <div className="flex justify-between">
        <button className="py-2 px-5 bg-white text-black my-2 rounded">All</button>
        {genreFilter}
      </div>
    </div>
  );
};

export default Chart;

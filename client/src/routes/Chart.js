import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  interpolateCool,
  scaleSequential,
  scaleTime,
} from "d3";
import { axisBottom, axisRight } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import objectMap from "../helpers/objectMap";
import InfoModal from "../components/InfoModal";

function Chart() {
  const [data, setData] = useState();
  const [genres, setGenres] = useState([]);
  const [chartDims, setChartDims] = useState({ width: 400, height: 400 });

  const [showInfo, setShowInfo] = useState(false);
  const [infoPos, setInfoPos] = useState({ left: 0, top: 0 });
  const [anime, setAnime] = useState({});
  const [animeBubbles, setAnimeBubbles] = useState([]);

  let animes = [];
  let scoreDomain = [Infinity, 0];
  let dateDomain = [Infinity, 0];
  let memberDomain = [Infinity, 0];

  const DATA_URL = "/data/dummy.json";
  // Data pull
  useEffect(() => {
    axios.get(DATA_URL).then((data) => {
      setData(data.data);
      setGenres(Object.keys(data.data));
    });
  }, [DATA_URL]);

  if (data !== undefined) {
    objectMap(data, (genre) => {
      animes = [...genre.animes, ...animes];
    });
    animes.forEach((a) => {
      if (a.score > scoreDomain[1]) scoreDomain[1] = a.score;
      else if (a.score < scoreDomain[0]) scoreDomain[0] = a.score;

      var start_date = Date.parse(a.start_date);
      if (start_date > dateDomain[1]) dateDomain[1] = start_date *= 1.05;
      else if (start_date < dateDomain[0]) dateDomain[0] = start_date *= 0.95;

      var members = a.members;
      if (members > memberDomain[1]) memberDomain[1] = members;
      else if (members < memberDomain[1]) memberDomain[0] = members;
    });
  };

  // d3.js stuff START
  
  // sequential color scale for bubble color to rep ratings
  const seqScale = scaleSequential().domain([0, 120]).interpolator(interpolateCool);

  const ratings = {
    "G": seqScale(10),
    "PG": seqScale(30),
    "PG-13": seqScale(50),
    "R": seqScale(70),
    "R+": seqScale(90),
    "Rx": seqScale(110)
  };

  var dateScale = scaleTime()
    .domain([new Date(dateDomain[0]), new Date(dateDomain[1])])
    .range([0, chartDims.width]);

  var scoreScale = scaleLinear()
    .domain([scoreDomain[0]-0.5, scoreDomain[1]+0.5])
    .range([chartDims.height, 0]);

  // Axes
  const xAxis = axisBottom()
    .scale(dateScale)
    .ticks(animes.length / 2);

  const yAxis = axisRight()
    .scale(scoreScale)
    .ticks(3);

  // d3.js stuff END
  
  let genreFilter;

  // Event handlers
  const logData = () => {
    console.log(data);
  };

  const plotGenre = (e) => {
    e.preventDefault();
    if (e.target.innerHTML !== "All") {
      let animesgenre = data[e.target.innerHTML];
      animes = [...animesgenre.animes];
    }
    setAnimeBubbles(animes);
  };

  const handleAnime = (e, i) => {
    e.persist();
    let animeUnderCursor = animes.filter((a) => a.title === animes[i].title);
    setAnime(animeUnderCursor[0]);
    setInfoPos({ left: e.screenX, top: e.screenY });
    setShowInfo(true);
  };

  genreFilter = genres.map((g, i) => {
    return (
      <button
        key={i}
        className="focus:outline-none transition duration-500 py-1 uppercase font-bold tracking-wider text-xs px-5 bg-white text-black my-2 rounded text-indigo-900 hover:text-white hover:bg-indigo-900 border"
        onClick={(e) => plotGenre(e)}
      >
        {g}
      </button>
    );
  });

  // Ratings legend
  let ratingsLegend = Object.keys(ratings).map((r, i) => {
    return (
      <button
        className="cursor-text focus:outline-none rounded-full m-2 bg-white font-bold text-black text-sm w-12 h-12 text-center items-center"
        style={{ "backgroundColor": ratings[r] }}
        key={i}
      >
        {r}
      </button>
    )
  });


  return (
    <div className="text-white flex flex-col">
      <InfoModal
        setShowInfo={setShowInfo}
        showInfo={showInfo}
        anime={anime}
        infoPos={infoPos}
      />
      <button
        onClick={() => logData()}
        className="my-3 py-3 px-5 bg-white text-black rounded font-bold font-mono"
      >
        Log Raw Data
      </button>
      <div className="w-full border">
        <svg
          width={chartDims.width}
          height={chartDims.height}
        >
          {animeBubbles.map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noopener noreferrer">
              <motion.circle
                cx={dateScale(new Date(a.start_date))}
                r={a.members / 100000}
                key={i}
                fill={ratings[a.rating]}
                onMouseEnter={(e) => handleAnime(e, i)}
                animate={{ cy: [0, scoreScale(a.score)] }}
                initial={{ cy: [0, 0] }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </a>
          ))}
          <g>
            <g ref={node => select(node).call(xAxis)} className="z-10" />
            <g ref={node => select(node).call(yAxis)} className="z-10" />
          </g>
        </svg>
      </div>
      <div className="flex justify-between">
        <button
          className="focus:outline-none transition duration-500 py-1 uppercase font-bold tracking-wider text-xs px-5 bg-white text-black my-2 rounded text-indigo-900 hover:text-white hover:bg-indigo-900 border"
          onClick={(e) => plotGenre(e)}
        >
          All
        </button>
        {genreFilter}
      </div>
      <div className="text-center tracking-wider font-bold text-sm mt-10 w-full">
        <div>
          Legend
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <div className="font-bold text-xs flex items-center uppercase">
          PG Rating
        </div>
        <div>
          {ratingsLegend}
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <div className="w-1/5 font-bold text-xs flex items-center uppercase">
          Community
        </div>
        <div className="w-4/5 flex justify-between items-center text-xs mx-10 font-bold">
          <span className="text-black bg-white rounded-full flex items-center justify-center" style={{ "height": "50px", "width": "50px" }}>{memberDomain[0]}</span>
          <span className="text-black bg-white rounded-full flex items-center justify-center" style={{ "height": "100px", "width": "100px" }}>{memberDomain[1]}</span>
        </div>
      </div>
    </div>
  );
}

export default Chart;

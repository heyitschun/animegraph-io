import React, { useEffect, useRef, useState } from "react";
import { interpolateCool, scaleSequential, scaleTime, timeFormat } from "d3";
import { axisTop, axisRight } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import objectMap from "../helpers/objectMap";
import InfoModal from "./InfoModal";

function Chart({ data, username, width }) {
  const [genres, setGenres] = useState([]);
  const [chartDims, setChartDims] = useState({ width: width, height: 600 });

  const [showInfo, setShowInfo] = useState(false);
  const [infoPos, setInfoPos] = useState({ left: 0, top: 0 });
  const [anime, setAnime] = useState({});
  const [animeBubbles, setAnimeBubbles] = useState([]);

  const [activeGenreKey, setActiveGenreKey] = useState("All");

  let scoreDomain = [Infinity, 0];
  let dateDomain = [Infinity, 0];
  let memberDomain = [Infinity, 0];
  let animes = [];

  useEffect(() => {
    setGenres(Object.keys(data));
    setAnimeBubbles(animes);
  }, [data]);

  objectMap(data, (genre) => {
    animes = [...genre.animes, ...animes];
  });
  animes.forEach((a) => {
    if (a.MAL_score > scoreDomain[1]) scoreDomain[1] = a.MAL_score;
    else if (a.MAL_score < scoreDomain[0]) scoreDomain[0] = a.MAL_score;

    var start_date = Date.parse(a.start_date);
    if (start_date > dateDomain[1]) dateDomain[1] = start_date *= 1.05;
    else if (start_date < dateDomain[0]) dateDomain[0] = start_date *= 0.95;

    var members = a.members;
    if (members > memberDomain[1]) memberDomain[1] = members;
    else if (members < memberDomain[1]) memberDomain[0] = members;
  });

  // d3.js stuff START

  // sequential color scale for bubble color to rep ratings
  const seqScale = scaleSequential()
    .domain([0, 120])
    .interpolator(interpolateCool);

  const ratings = {
    G: seqScale(10),
    PG: seqScale(30),
    "PG-13": seqScale(50),
    R: seqScale(70),
    "R+": seqScale(90),
    Rx: seqScale(110),
  };

  var dateScale = scaleTime()
    .domain([new Date(dateDomain[0]), new Date(dateDomain[1])])
    .range([0, chartDims.width]);

  var scoreScale = scaleLinear()
    .domain([scoreDomain[0] - 0.5, scoreDomain[1] + 0.5])
    .range([chartDims.height, 0]);

  // Axes
  const xAxis = axisTop().scale(dateScale);

  const yAxis = axisRight().scale(scoreScale);
  //yAxis.tickSizeOuter(0);
  // d3.js stuff END

  let genreFilter;

  // Event handlers

  const plotGenre = (e, g) => {
    e.preventDefault();
    setActiveGenreKey(g);
    if (e.target.innerHTML !== "All") {
      let animesgenre = data[e.target.innerHTML];
      animes = [...animesgenre.animes];
    }
    setAnimeBubbles(animes);
  };

  const handleAnime = (e, title) => {
    e.persist();
    let animeUnderCursor = animes.filter((a) => a.title === title);
    setAnime(animeUnderCursor[0]);
    setInfoPos({ left: e.screenX, top: e.screenY });
    setShowInfo(true);
  };

  genreFilter = genres.map((g, i) => {
    return (
      <button
        key={i}
        className={`focus:outline-none transition duration-500 py-1 uppercase font-bold tracking-wider text-xs px-5 text-white my-2 rounded hover:bg-indigo-700 hover:text-white border mx-2 ${
          activeGenreKey === g ? "bg-indigo-500" : ""
        }`}
        onClick={(e) => plotGenre(e, g)}
      >
        {g}
      </button>
    );
  });

  // Ratings legend
  let ratingsLegend = Object.keys(ratings).map((r, i) => {
    return (
      <button
        className="cursor-text focus:outline-none rounded-full my-2 mx-1 bg-white font-bold text-black text-xs w-10 h-10 text-center items-center"
        style={{ backgroundColor: ratings[r] }}
        key={i}
      >
        {r}
      </button>
    );
  });

  return (
    <div className="flex flex-row">
      <div className="text-white flex flex-col">
        <InfoModal
          setShowInfo={setShowInfo}
          showInfo={showInfo}
          anime={anime}
          infoPos={infoPos}
        />

        <a
          href={`https://myanimelist.net/profile/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="my-3 py-3 px-5 text-center bg-white text-black rounded font-bold font-mono"
        >
          {username}
        </a>
        <div className="w-full">
          <svg
            width={chartDims.width}
            height={chartDims.height}
            style={{ "paddingBottom": "0" }}
          >
            {animeBubbles.map((a, i) => (
                <circle
                  fillOpacity="0.7"
                  cx={dateScale(new Date(a.start_date))}
                  cy={scoreScale(Number(a.MAL_score))}
                  r={Math.max(5, a.members / 30000)}
                  key={i}
                  fill={ratings[a.rating]}
                  onMouseEnter={(e) => handleAnime(e, a.title)}
                />
            ))}
            <g>
              <g
                ref={(node) => select(node).call(xAxis)}
                className="z-10"
                style={{ transform: `translateY(${chartDims.height - 2}px)` }}
              />
              <g ref={(node) => select(node).call(yAxis)} className="z-10" />
            </g>
          </svg>
        </div>
        <div className="text-center tracking-wider font-bold text-sm mb-4 mt-4 w-full">
          Date Released
        </div>
        <div className="flex justify-center">
          <button
            className={`focus:outline-none transition duration-500 py-1 uppercase font-bold tracking-wider text-xs px-5 text-white my-2 rounded hover:text-white border mx-2 ${
              activeGenreKey === "All" ? "bg-indigo-700" : ""
            }`}
            onClick={(e) => plotGenre(e, "All")}
          >
            All
          </button>
          {genreFilter}
        </div>
        <div>
          <div className="text-center tracking-wider font-bold text-sm mt-10 w-full">
            Legend
          </div>
          <div className="flex justify-center">
            <span className="w-1/5 text-xs font-bold flex items-center text-left">PG Rating</span>
            <div className="w-4/5">
              {ratingsLegend}
            </div>
          </div>
          <div className="flex mt-1 justify-center">
            <span className="w-1/5 text-xs font-bold flex items-center text-left">Community</span>
            <div className="w-4/5">
              {/* Members legend */}
            </div>
          </div>
           <div></div>
        </div>
      </div>
    </div>
  );
}

export default Chart;

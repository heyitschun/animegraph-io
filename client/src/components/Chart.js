import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { interpolateCool, scaleSequential, scaleTime } from "d3";
import { axisTop, axisRight } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import objectMap from "../helpers/objectMap";
import InfoModal from "./InfoModal";

function Chart({ data, username, width }) {
  console.log("CHARTS.JS>>>", data);
  const [genres, setGenres] = useState([]);
  const [chartDims, setChartDims] = useState({ width: width, height: 600 });

  const [showInfo, setShowInfo] = useState(false);
  const [infoPos, setInfoPos] = useState({ left: 0, top: 0 });
  const [anime, setAnime] = useState({});
  const [animeBubbles, setAnimeBubbles] = useState([]);

  let scoreDomain = [Infinity, 0];
  let dateDomain = [Infinity, 0];
  let memberDomain = [Infinity, 0];
  let animes = [];

  useEffect(() => {
    setGenres(Object.keys(data));
  }, [data]);

  objectMap(data, (genre) => {
    animes = [...genre.animes, ...animes];
    console.log(animes);
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

  console.log(scoreDomain);

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
  const xAxis = axisTop().scale(dateScale).ticks(10);

  const yAxis = axisRight().scale(scoreScale).ticks(10);

  // d3.js stuff END

  let genreFilter;

  // Event handlers

  const plotGenre = (e) => {
    e.preventDefault();
    if (e.target.innerHTML !== "All") {
      let animesgenre = data[e.target.innerHTML];
      animes = [...animesgenre.animes];
      console.log(animes);
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
        className="focus:outline-none transition duration-500 py-1 uppercase font-bold tracking-wider text-xs px-5 bg-white text-black my-2 rounded text-indigo-900 hover:text-white hover:bg-indigo-900 border mx-2"
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
        style={{ backgroundColor: ratings[r] }}
        key={i}
      >
        {r}
      </button>
    );
  });

  return (
    <div className="flex flex-row">
      {/*
      <div className="">
        <span style={{ position: "abso" }}>MyAnimeList Score</span>
      </div>
      */}
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
          <svg width={chartDims.width} height={chartDims.height}>
            {animeBubbles.map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noopener noreferrer">
                <circle
                  fillOpacity="0.7"
                  cx={dateScale(new Date(a.start_date))}
                  cy={scoreScale(Number(a.MAL_score))}
                  r={Math.max(5, a.members / 30000)}
                  key={i}
                  fill={ratings[a.rating]}
                  onMouseEnter={(e) => handleAnime(e, a.title)}
                />
              </a>
            ))}
            <g>
              <g>
                <text className="z-10 text-white"> SOME TEXT</text>
              </g>
              <g
                ref={(node) => select(node).call(xAxis)}
                className="z-10"
                style={{ transform: `translateY(${chartDims.height - 2}px)` }}
              />
              <g ref={(node) => select(node).call(yAxis)} className="z-10" />
            </g>
          </svg>
        </div>
        <div className="text-center tracking-wider font-bold text-sm mb-6 mt-5 w-full">
          Date Anime Released
        </div>
        <div className="flex justify-center">
          <button
            className="focus:outline-none transition duration-500 py-1 uppercase font-bold tracking-wider text-xs px-5 bg-white text-black my-2 rounded text-indigo-900 hover:text-white hover:bg-indigo-900 border mx-2"
            onClick={(e) => plotGenre(e)}
          >
            All
          </button>
          {genreFilter}
        </div>
        <div className="text-center tracking-wider font-bold text-sm mt-10 w-full">
          Legend
        </div>
        <div className="flex justify-center">{ratingsLegend}</div>
      </div>
    </div>
  );
}

export default Chart;

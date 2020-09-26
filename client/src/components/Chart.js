import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { interpolateCool, scaleSequential, scaleTime } from "d3";
import { axisTop, axisRight } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import objectMap from "../helpers/objectMap";
import HelpIcon from "../components/icons/HelpIcon";
import MemberModal from "../components/MemberModal";

function Chart({
  data,
  username,
  width,
  anime,
  setAnime,
  handleAnime,
  animeBubbles,
  setAnimeBubbles,
}) {
  const [genres, setGenres] = useState([]);
  const [chartDims, setChartDims] = useState({ width: width, height: 600 });
  const [showMemberHelp, setShowMemberHelp] = useState(false);
  // 3 is All
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

  genreFilter = genres.map((g, i) => {
    return (
      <button
        key={i}
        className={`focus:outline-none transition duration-500 py-1 uppercase font-bold tracking-wider text-xs px-5 text-white my-2 rounded hover:text-white border mx-2 ${
          activeGenreKey === g ? "bg-gray-700" : ""
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
      <MemberModal
        showMemberHelp={showMemberHelp}
        setShowMemberHelp={setShowMemberHelp}
      />
      <div className="text-white flex flex-col">
        <a
          href={`https://myanimelist.net/profile/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="my-3 py-3 px-5 text-center text-white rounded font-bold font-sans"
        >
          welcome, {username}!
        </a>
        <div className="w-full">
          <svg
            width={chartDims.width}
            height={chartDims.height}
            style={{ "padding-bottom": "0px" }}
          >
            {animeBubbles.map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noopener noreferrer">
                <circle
                  class={anime.title === a.title ? "active-bubble" : ""}
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
              <g
                ref={(node) => select(node).call(xAxis)}
                className="z-10"
                style={{ transform: `translateY(${chartDims.height - 2}px)` }}
              />
              <g ref={(node) => select(node).call(yAxis)} className="z-10" />
            </g>
          </svg>
        </div>
        <div className="text-center tracking-wider font-bold text-sm mt-4 w-full">
          Date Released
        </div>

        <div className="flex justify-center mt-3 mb-6">
          <button
            className={`focus:outline-none transition duration-500 py-1 uppercase font-bold tracking-wider text-xs px-5 text-white my-2 rounded hover:text-white border mx-2 ${
              activeGenreKey === "All" ? "bg-gray-700" : ""
            }`}
            onClick={(e) => plotGenre(e, "All")}
          >
            All
          </button>
          {genreFilter}
        </div>

        <div className="flex justify-center">
          <div className="w-1/2 text-center">
            <div> Maturity Rating </div>
            <div className="flex justify-center"> {ratingsLegend}</div>
          </div>
          <div className="w-1/2">
            <div className="text-center">
              Community Members
              <button
                className="focus:outline-none hover:scale-105 ml-2"
                onClick={() => setShowMemberHelp(true)}
              >
                <HelpIcon />
              </button>
              <div className="justify-center flex items-center">
                <button className="border cursor-text focus:outline-none rounded-full my-2 ml-4 mx-1 bg-white font-bold text-black text-xs w-2 h-2 text-center items-center"></button>
                <button className="cursor-text focus:outline-none rounded-full my-2 ml-4 mx-1 bg-white font-bold text-black text-xs w-4 h-4 text-center items-center"></button>
                <button className="cursor-text focus:outline-none rounded-full my-2 ml-4 mx-1 bg-white font-bold text-black text-xs w-6 h-6 text-center items-center"></button>
                <button className="cursor-text focus:outline-none rounded-full my-2 ml-4 mx-1 bg-white font-bold text-black text-xs w-12 h-12 text-center items-center"></button>
              </div>
            </div>
            <div className="text-xs font-bold text-center">
              <p>&lt; 150K&ensp;250K&ensp;&ensp;350K&ensp;&ensp;&ensp;750k+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chart;

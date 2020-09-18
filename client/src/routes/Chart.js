import React, { useState, useEffect } from "react";
import axios from "axios";
import { create, schemeAccent } from "d3";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import objectMap from "../helpers/objectMap";
import InfoModal from "../components/InfoModal";
import ChartWithDimensions from "../components/ChartDimensions";

function Chart() {
  const [data, setData] = useState();
  const [genres, setGenres] = useState([]);
  const [chartDims, setChartDims] = useState({ width: 400, height: 100 });

  const [showInfo, setShowInfo] = useState(false);
  const [infoPos, setInfoPos] = useState({ left: 0, top: 0 });
  const [anime, setAnime] = useState({});
  const [animeBubbles, setAnimeBubbles] = useState([]);

  let animes = [];
  let domain = [0, 0];
  let scoreDomain = [Infinity, 0];
  let dateDomain = [Infinity, 0];
  let memberDomain = [Infinity, 0];

  // Data pull
  useEffect(() => {
    axios.get("/data/dummy.json").then((data) => {
      setData(data.data);
      setGenres(Object.keys(data.data));
    });
  }, []);

  if (data !== undefined) {
    objectMap(data, (genre) => {
      animes = [...genre.animes, ...animes];
    });
    animes.map((a) => {
      if (a.score > scoreDomain[1]) scoreDomain[1] = a.score;
      else if (a.score < scoreDomain[0]) scoreDomain[0] = a.score;
      var start_date = Date.parse(a.start_date);
      if (start_date > dateDomain[1]) dateDomain[1] = start_date;
      else if (start_date < dateDomain[0]) dateDomain[0] = start_date;
      var members = a.members;
      if (members > memberDomain[1]) memberDomain[1] = members;
      else if (members < memberDomain[1]) memberDomain[0] = members;
    });
  }

  let genreFilter;

  // Event handlers
  const logData = () => {
    console.log(data);
  };

  const hoverHandle = () => {
    console.log("Hover action works");
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
        className="py-2 px-5 bg-white text-black my-2 rounded"
        onClick={(e) => plotGenre(e)}
      >
        {g}
      </button>
    );
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
          viewBox="0 0 100 50"
        >
          <ChartWithDimensions></ChartWithDimensions>
          {animeBubbles.map((a, i) => (
            <a href={a.url} target="_blank" rel="noopener referrer">
              <circle
                cx={i * 10}
                cy={a.score}
                r={a.members / 100000}
                key={i}
                fill="white"
                stroke="white"
                onMouseEnter={(e) => handleAnime(e, i)}
              />
            </a>
          ))}
        </svg>
      </div>
      <div className="flex justify-between">
        <button
          className="py-2 px-5 bg-white text-black my-2 rounded"
          onClick={(e) => plotGenre(e)}
        >
          All
        </button>
        {genreFilter}
      </div>
    </div>
  );
}

export default Chart;

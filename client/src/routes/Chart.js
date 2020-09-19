import React, { useState, useEffect } from "react";
import axios from "axios";
import { scaleTime, scaleSequential, interpolateCool } from "d3";
import { scaleLinear } from "d3-scale";
import objectMap from "../helpers/objectMap";
import InfoModal from "../components/InfoModal";
import ChartWithDimensions from "../components/ChartDimensions";

function Chart() {
  const [data, setData] = useState();
  const [genres, setGenres] = useState([]);
  const [chartDims, setChartDims] = useState({ width: 400, height: 400 });

  const [showInfo, setShowInfo] = useState(false);
  const [infoPos, setInfoPos] = useState({ left: 0, top: 0 });
  const [anime, setAnime] = useState({});
  const [animeBubbles, setAnimeBubbles] = useState([]);

  let animes = [];
  let domain = [0, 0];
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
  
  // sequential color scale for bubble color
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

  // d3.js stuff END
  
  // Ratings legend
  let ratingsLegend = Object.keys(ratings).map((r, i) => {
    return (
      <button
        className="cursor-text focus:outline-none rounded-full m-2 bg-white font-bold text-black text-sm w-12 h-12 text-center items-center"
        style={{ "background-color": ratings[r] }}
        key={i}
      >
        {r}
      </button>
    )
  });

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
        >
          <ChartWithDimensions></ChartWithDimensions>
          {animeBubbles.map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noopener noreferrer">
              <circle
                cx={dateScale(new Date(a.start_date))}
                cy={scoreScale(Number(a.score))}
                r={a.members / 100000}
                key={i}
                fill={ratings[a.rating]}
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
      <div className="text-center tracking-wider font-bold text-sm mt-10 w-full">
        Legend
      </div>
      <div className="flex justify-center">
        {ratingsLegend}
      </div>
    </div>
  );
}

export default Chart;

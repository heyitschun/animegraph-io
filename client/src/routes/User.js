import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAxiosRequest } from "../hooks/HttpRequest";
import objectMap from "../helpers/objectMap";
import Footer from "../components/Footer";
import RetryIcon from "../components/icons/RetryIcon";
import Chart from "../components/Chart";

function User({ match }) {
  const [showInfo, setShowInfo] = useState(false);
  const [infoPos, setInfoPos] = useState({ left: 0, top: 0 });
  const [chartWidth, setChartWidth] = useState(0);
  const chartWidthRef = useRef(0);
  const [anime, setAnime] = useState({});
  const [animeBubbles, setAnimeBubbles] = useState([]);
  const user = match.params.user;
  let data = useAxiosRequest(user);
  let display = null;
  let chart = null;
  let animes = [];
  let YLabel = "";

  useEffect(() => {
    setChartWidth(chartWidthRef.current.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    console.log(animeBubbles);
    display = animeBubbles.map((anime, i) => {
      return (
        <motion.div key={i} className="my-1">
          <li>
            <button
              className="hover:text-indigo-200 text-sm text-left focus:outline-none"
              onMouseEnter={(e) => handleAnime(e, anime.title)}
            >
              {anime.title}
            </button>
          </li>
        </motion.div>
      );
    });
  }, [animeBubbles]);

  const handleAnime = (e, title) => {
    e.persist();
    let animeUnderCursor = animes.filter((a) => a.title === title);
    setAnime(animeUnderCursor[0]);
  };

  if (data.error) {
    chart = [
      <li className="text-center mt-48 font-mono">Something went wrong :(</li>,
      <li className="justify-center flex mt-5">
        <button className="focus:outline-none">
          <RetryIcon />
        </button>
      </li>,
      <li className="font-mono text-center mt-2 text-sm">Retry</li>,
    ];
  }

  if (data.loading) {
    chart = [
      <div key="load-anime" className="justify-center flex mt-48 w-full">
        <div className="loading">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>,
      <div key="load-text" className="text-center font-mono w-full">
        Loading...
      </div>,
    ];
  }

  if (data.data) {
    objectMap(data.data, (x) => {
      animes = [...x.animes, ...animes];
    });

    display = animes.map((anime, i) => {
      return (
        <motion.div key={i} className="my-1">
          <li>
            <button
              className="hover:text-indigo-200 text-sm text-left focus:outline-none"
              onMouseEnter={(e) => handleAnime(e, anime.title)}
            >
              {anime.title}
            </button>
          </li>
        </motion.div>
      );
    });

    chart = (
      <Chart
        data={data.data}
        username={user}
        width={chartWidth}
        anime={anime}
        setAnime={setAnime}
        handleAnime={handleAnime}
        animeBubbles={animeBubbles}
        setAnimeBubbles={setAnimeBubbles}
      />
    );
    YLabel = "MyAnimeList Score";
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="mt-8 mx-10 lg:mx-64 flex flex-row flex-1 text-white">
        {/* Left */}
        <div className="w-1/5 mt-12">
          <div className="text-sm break-normal">
            {anime.title ? (
              <>
                <span className="font-bold text-lg tracking-widest text-white">
                  {anime.title}
                </span>
                <hr className="mb-2 mr-4" />
                <img src={anime.image_url} alt={anime.title} />
                <br />
                <span>User Score: {anime.score}</span>
                <br />
                <span>MAL Score: {anime.MAL_score}</span>
                <br />
                <span>Members: {anime.members}</span>
                <br />
                <br />
                <span>Genres: {anime.genres.join(", ")}</span>
                <br />
                {anime.tags && (
                  <span>
                    <br />
                    User Thoughts: <br /> {anime.tags}
                  </span>
                )}
              </>
            ) : (
              <img />
            )}
          </div>
        </div>

        {/* Middle */}
        <div className="w-3/5 mr-10 ml-5 flex flex-row">
          <div
            className="text-white fold-bold w-1/12 flex justify-center items-center relative"
            style={{ height: "650px" }}
          >
            <span className="block transform -rotate-90 absolute font-bold text-center tracking-widest text-sm w-64 ml-3">
              {YLabel}
            </span>
          </div>
          <div ref={chartWidthRef} className="w-11/12">
            {chart}
          </div>
        </div>

        {/* Right */}
        <div className="w-1/5" style={{ height: "41rem" }}>
          {animes.length !== 0 && (
            <>
              <div className="mt-12 font-bold text-lg tracking-widest text-white">
                User Anime List
              </div>
              <hr className="mr-24" />
            </>
          )}
          <ul className="overflow-y-auto" style={{ height: "38rem" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              {display}
            </motion.div>
          </ul>
        </div>
      </div>
      <Footer className="flex-shrink" />
    </div>
  );
}

export default User;

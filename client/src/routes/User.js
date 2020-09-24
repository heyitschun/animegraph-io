import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAxiosRequest } from "../hooks/HttpRequest";
import objectMap from "../helpers/objectMap";
import Footer from "../components/Footer";
import InfoModal from "../components/InfoModal";
import RetryIcon from "../components/icons/RetryIcon";
import Chart from "../components/Chart";

function User({ match }) {
  const [showInfo, setShowInfo] = useState(false);
  const [infoPos, setInfoPos] = useState({ left: 0, top: 0 });
  const [anime, setAnime] = useState({});
  const [chartWidth, setChartWidth] = useState(0);
  const chartWidthRef = useRef(0);
  const user = match.params.user;
  let data = useAxiosRequest(user);
  let display = null;
  let chart = null;
  let animes = [];
  let YLabel = "";

  useEffect(() => {
    setChartWidth(chartWidthRef.current.getBoundingClientRect().width);
  }, []);

  const handleAnime = (e) => {
    e.persist();
    console.log(e.target.innerHTML);
    let animeUnderCursor = animes.filter((a) => a.title === e.target.innerHTML);
    setAnime(animeUnderCursor[0]);
    setInfoPos({ left: e.screenX, top: e.screenY });
    setShowInfo(true);
  };

  if (data.error) {
    chart = [
      <div className="text-center mt-48 font-mono">Something went wrong :(</div>,
      <div className="justify-center flex mt-5">
        <button className="focus:outline-none">
          <RetryIcon />
        </button>
      </div>,
      <div className="font-mono text-center mt-2 text-sm">Retry</div>,
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
            >
              {anime.title}
            </button>
          </li>
        </motion.div>
      );
    });

    chart = <Chart data={data.data} username={user} width={chartWidth} />;
    YLabel = "MyAnimeList Score";
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="mt-8 mx-10 lg:mx-64 flex flex-row flex-1 text-white">

        {/* Left */}
        <div className="w-1/5"></div>

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
              <div className="mt-12 font-bold text-base lg:text-lg tracking-widest text-white">
                Your Popular Animes
              </div>
              <hr className="mr-10 lg:mr-24" />
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

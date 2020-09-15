import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAxiosRequest } from "../hooks/HttpRequest";
import objectMap from "../helpers/objectMap";
import Footer from "../components/Footer";
import InfoModal from "../components/InfoModal";
import RetryIcon from "../components/icons/RetryIcon";


function User({ match }) {
  const [showInfo, setShowInfo] = useState(false);
  const [infoPos, setInfoPos] = useState({left: 0, top: 0});
  const [anime, setAnime] = useState({});
  const user = match.params.user;
  let data = useAxiosRequest(user);
  let display = null;
  let animes = [];

  const handleAnime = (e) => {
    e.persist();
    let animeUnderCursor = animes.filter((a) => a.title === e.target.innerHTML);
    setAnime(animeUnderCursor[0]);
    setInfoPos({left: e.screenX, top: e.screenY});
    setShowInfo(true);
  }

  if (data.error) {
    display = [
      <li className="text-center mt-48 font-mono">Something went wrong :(</li>,
      <li className="justify-center flex mt-5">
        <button className="focus:outline-none">
          <RetryIcon />
        </button>
      </li>,
      <li className="font-mono text-center mt-2 text-sm">
        Retry
      </li>
    ]
  }

  if (data.loading) {
    display = [
      <li key="load-anim" className="justify-center flex mt-48">
        <div className="loading"><div></div><div></div><div></div></div>
      </li>,
      <li key="load-text" className="text-center font-mono">Loading...</li>
    ]
  }

  if (data.data) {
    objectMap(data.data, (x) => {
      animes = [...x.animes, ...animes]
    });

    display = animes.map((anime, i) => {
      return (
        <motion.div
          key={i}
          className="my-1"
        >
          <li>
            <button
              onMouseEnter={(e) => handleAnime(e)}
              onMouseLeave={() => setShowInfo(false)}
              className="hover:text-indigo-200 text-sm text-left focus:outline-none"
            >
              {anime.title}
            </button>
          </li>
        </motion.div>
      )
    }
   );
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <InfoModal
        setShowInfo={setShowInfo}
        showInfo={showInfo}
        anime={anime}
        infoPos={infoPos}
      />
      <div className="mt-32 border flex flex-row flex-1 text-white">
        <div className="w-1/4 border border-green-500">
          <ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: .5 }}
            >
              {display}
            </motion.div>
          </ul>
        </div>
        <div className="w-1/2 border border-red-500">
          middle
        </div>
        <div className="w-1/4 border border-yellow-500">
          right
        </div>
      </div>
      <Footer className="flex-shrink" />
    </div>
  );
};

export default User;

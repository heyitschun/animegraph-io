import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAxiosRequest } from "../hooks/HttpRequest";
import objectMap from "../helpers/objectMap";
import Footer from "../components/Footer";
import InfoModal from "../components/InfoModal";


function User({ match }) {
  const [showInfo, setShowInfo] = useState(false);
  const user = match.params.user;
  let data = useAxiosRequest(user);
  let display = null;

  const handleAnime = (e) => {
    e.persist();
    setShowInfo(!showInfo);
    console.log(e.screenX, e.screenY)
  }

  if (data.error) {
    display = <div>something went wrong</div>
  }

  if (data.loading) {
    display = [
      <li key="load-anim" className="justify-center flex mt-48">
        <div className="loading"><div></div><div></div><div></div></div>
      </li>,
      <li key="load-text" className="text-center">Loading...</li>
    ]
  }

  if (data.data) {
    let animes = [];
    objectMap(data.data, (x) => {
      animes = [...x.animes, ...animes]
    });

    display = animes.map((anime, i) => {
      return (
        <motion.div
          key={i}
          className="hover:text-indigo-200 my-2"
        >
          <li>
            <button
              onMouseEnter={(e) => handleAnime(e)}
              onMouseLeave={(e) => handleAnime(e)}
              className="focus:outline-none">
            {anime.title}
            </button>
          </li>
        </motion.div>
      )
    }
   );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <InfoModal setShowInfo={setShowInfo} showInfo={showInfo} anime={null} />
      <div className="flex-1 text-white">
        <ul className="mt-10">
          {display}
        </ul>
      </div>
      <Footer className="flex-shrink" />
    </div>
  );
};

export default User;

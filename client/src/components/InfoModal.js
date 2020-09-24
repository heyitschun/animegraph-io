import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const helpVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

function InfoModal({ anime, showInfo, setShowInfo, infoPos }) {
  return (
    <AnimatePresence exitBeforeEnter>
      {showInfo && (
        <motion.div
          className="z-50 fixed top-0 left-0 w-full h-full bg-opacity-0"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={() => setShowInfo(false)}
        >
        <motion.div
          className="flex w-64 h-auto absolute p-4 bg-indigo-900 text-white rounded shadow border border-gray-100"
          style={{ left: 200, top: 100 }}
          variants={helpVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="text-sm break-normal">
            <span className="font-bold"> {anime.title} </span>
            <hr className="my-2" />
            <a href={anime.url} rel="noopener noreferrer" target="_blank">
              <img src={anime.image_url} alt={anime.title}/>
            </a>
            <div className="mb-2 text-center">
              <a className="hover:text-indigo-400 transition duration-200" href={anime.url} rel="noopener noreferred" target="_blank">View on MyAnimeList</a>
            </div>
            <br />
            <span>User Score: {anime.score}</span>
            <br />
            <span>MAL Score: {anime.MAL_score}</span>
            <br />
            <br />
            <span> Genres: {anime.genres.join(", ")}</span>
            <br />
            {anime.tags && (
              <span>
                <br />
                Your Thoughts: <br /> {anime.tags}
              </span>
            )}
          </div>
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InfoModal;

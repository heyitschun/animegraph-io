import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const helpVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

function InfoModal({ anime, showInfo, setShowInfo, infoPos }) {
  console.log(anime);
  return (
    <AnimatePresence exitBeforeEnter>
      {showInfo && (
        <motion.div
          className="z-50 flex w-64 h-auto absolute p-4 bg-gray-900 text-white rounded shadow border border-gray-100"
          style={{ left: 200, top: 100 }}
          onClick={() => setShowInfo(false)}
          variants={helpVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="text-sm break-normal">
            <span className="font-bold"> {anime.title} </span>
            <hr className="my-2" />
            <img src={anime.image_url} alt={anime.title} />
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
                User Thoughts: <br /> {anime.tags}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InfoModal;

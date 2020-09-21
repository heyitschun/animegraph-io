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
  return (
    <AnimatePresence exitBeforeEnter>
      {showInfo && (
        <motion.div
          className="z-50 w-auto h-auto absolute p-4 bg-indigo-900 text-white rounded shadow border border-gray-100"
          style={{ left: 0, top: 0 }}
          onClick={() => setShowInfo(false)}
          variants={helpVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="text-sm">
            {anime.title}
            <hr className="my-2" />
            <img src={anime.image_url} alt={anime.title} />
            <br />
            <span>User Score: {anime.score}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InfoModal;

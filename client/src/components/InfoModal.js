import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const helpVariants = {
  hidden: {
    y: "-100vh",
    opacity: 0
      
  },
  visible: {
    y: "200px",
    opacity: 1,
  } 
}

function InfoModal({ anime, showInfo, setShowInfo }) {
  return (
    <AnimatePresence exitBeforeEnter>
      { showInfo && (
        <motion.div
          className="z-50 absolute m-auto p-4 max-w-lg bg-indigo-900 text-white rounded shadow border border-gray-100"
          onClick={() => setShowInfo(false)}
          variants={helpVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div>hello</div>
        </motion.div>
      ) }
    </AnimatePresence>
  );
};

export default InfoModal;

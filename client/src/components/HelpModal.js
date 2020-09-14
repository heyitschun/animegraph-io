import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "../components/icons/CloseIcon";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const helpVariants = {
  hidden: {
    y: "-100vh",
    opacity: 0
  },
  visible: {
    y: "200px",
    opacity: 1
  }
}

function HelpModal({ showHelp, setShowHelp }) {

  return (
    <AnimatePresence exitBeforeEnter>
      { showHelp && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="m-auto p-4 max-w-lg bg-indigo-900 text-white rounded shadow border border-gray-100"
            variants={helpVariants}
          >
            <div className="flex justify-between">
              <h1 className="font-bold tracking-wider">What AnimeGraph-io?</h1>
              <button onClick={() => setShowHelp(false)}>
                <CloseIcon />
              </button>
            </div>
            <hr className="my-2" />
            <div>
              <p>Description</p>
            </div>
          </motion.div>
        </motion.div>
      ) }
    </AnimatePresence>
  );
};

export default HelpModal;

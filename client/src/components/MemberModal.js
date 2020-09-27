import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "../components/icons/CloseIcon";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const helpVariants = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "200px",
    opacity: 1,
  },
};

function MemberModal({ showMemberHelp, setShowMemberHelp }) {
  return (
    <AnimatePresence exitBeforeEnter>
      {showMemberHelp && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-opacity-50 z-50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="m-auto p-4 max-w-lg w-1/6 bg-gray-900 text-white rounded shadow border border-gray-100"
            style={{ position: "absolute", right: "300px", top: "550px" }}
            variants={helpVariants}
          >
            <div className="flex justify-between">
              <h1 className="font-bold tracking-wider">Members</h1>
              <button onClick={() => setShowMemberHelp(false)}>
                <CloseIcon />
              </button>
            </div>
            <hr className="my-2" />
            <div>
              <p>
                The size of the bubbles represent the number of members for said
                anime.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MemberModal;

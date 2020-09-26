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

function HelpModal({ showHelp, setShowHelp }) {
  return (
    <AnimatePresence exitBeforeEnter>
      {showHelp && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="m-auto p-4 max-w-lg bg-gray-900 text-white rounded shadow border border-gray-100"
            variants={helpVariants}
          >
            <div className="flex justify-between">
              <h1 className="font-bold tracking-wider">
                The Creators: Who are We?
              </h1>
              <button onClick={() => setShowHelp(false)}>
                <CloseIcon />
              </button>
            </div>
            <hr className="my-2" />
            <div>
              <p>
                Hey, I'm David, previously a consultant at IBM and now working
                at a startup! I enjoy coding (and anime/manga) in my spare time;
                I actually wanted to build this project for my friends to see
                what shows they've seen. It's funny because I actually have
                never made a MAL account, but maybe this'll actually make me
                start tracking what I've watched.
                <a
                  href="https://www.linkedin.com/in/david-sung-229b52113/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline text-white"
                >
                  <br />
                  Feel free to reach out to me on LinkedIn!
                </a>
              </p>
              <br />
              <p>
                Hey, I'm Chun. Poker player turned full-stack developer.
                Passionate about building cool things, and this project was
                pretty fun to build and design!
                <br />
                <a
                  href="https://github.com/heyitschun"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline"
                >
                  Check out my Github!
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HelpModal;

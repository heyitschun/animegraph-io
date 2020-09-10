import React, { useState } from "react";
import { motion } from "framer-motion";
import HelpIcon from "../components/icons/HelpIcon";
import UsernameInput from "../components/UsernameInput";
import HelpModal from "../components/HelpModal";

function Home({ user }) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <div className="mt-32 w-full">
        <HelpModal showHelp={showHelp} setShowHelp={setShowHelp} />
        <motion.div
          initial={{ y: -250 }}
          animate={{ y: 10 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        >
          <div className="text-center text-white font-kufam tracking-wider font-bold text-2xl">
            AnimeGraph-io
          </div>
        </motion.div>
        <motion.div
          className="flex justify-center mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <button
            onClick={() => setShowHelp(true)}
            className="focus:outline-none hover:scale-105"
          >
            <HelpIcon />
          </button>
        </motion.div>
        <motion.div
          className="flex justify-center mt-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <UsernameInput />
        </motion.div>
      </div>
    </>
  );
}

export default Home;

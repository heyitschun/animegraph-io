import React from "react";
import { motion } from "framer-motion";
import HelpIcon from "../components/icons/HelpIcon";
import UsernameInput from "../components/UsernameInput";


function Home() {
  return (
    <>
      <div className="mt-32 w-full">
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
          <button className="focus:outline-none hover:scale-105">
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
};

export default Home;

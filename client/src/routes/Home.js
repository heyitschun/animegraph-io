import React, { useState } from "react";
import { motion } from "framer-motion";
import HelpIcon from "../components/icons/HelpIcon";
import UsernameInput from "../components/UsernameInput";
import HelpModal from "../components/HelpModal";

function Home({ user }) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="flex mt-5 flex-col">
      <div className="w-full text-white flex justify-end">
         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="text-white">
            <button className="rounded border transition duration-500 hover:text-white hover:bg-gray-900 bg-white text-gray-900 font-bold px-2 py-1 mr-4 tracking-wider w-24 text-sm">Login</button>
            <button className="rounded border transition duration-500 hover:text-white hover:bg-gray-900 bg-white text-gray-900 font-bold px-2 py-1 mr-4 tracking-wider w-24 text-sm">Signup</button>
          </div>
        </motion.div>
      </div>
      <div className="mt-32 w-full">
        <HelpModal showHelp={showHelp} setShowHelp={setShowHelp} />
        <motion.div
          initial={{ y: -500 }}
          animate={{ y: 10 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        >
          <div className="text-center text-white font-sans tracking-wider font-bold text-4xl">
            Slice of Seikatsu
          </div>

          <div className="m-auto p-4 max-w-lg bg-gray-900 text-white ">
            <p>
              Seikatsu (せいかつ) means life in Japanese; Slice of Seikatsu is
              an anime visualizer to help a MyAnimeList user see what shows make
              up his/her most watched genres. A taste of your anime life!
            </p>
            <br />
            <p>
              If you do not have a MyAnimeList user, feel free to type in
              "RebelPanda" as an example!
            </p>
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
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <UsernameInput />
        </motion.div>
        <div className="flex justify-center">
          <img src="https://thumbs.gfycat.com/ShadowyBetterJoey-max-1mb.gif"></img>
        </div>
      </div>
    </div>
  );
}

export default Home;

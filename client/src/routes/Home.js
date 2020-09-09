import React, { useState } from "react";
import { motion } from "framer-motion";
import HelpIcon from "../components/icons/HelpIcon";
import UsernameInput from "../components/UsernameInput";
import HelpModal from "../components/HelpModal";
// import { useAxiosRequest } from "../hooks/HttpRequest";
import axios from "axios";

function Home() {
  const [showHelp, setShowHelp] = useState(false);
  const [username, setUsername] = useState("");

  const getData = async (e) => {
    e.preventDefault();
    axios
      .get("/api/get-top-ten", { params: { user: username } })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your MyAnimeList username..."
            className="rounded focus:outline-none w-full p-2 font-mono text-lg text-center"
          />
          <button
            onClick={getData}
            className="transition duration-500 rounded py-2 px-5 md:ml-2 ml-0 mt-4 md:mt-0 md:w-1/5 w-full tracking-widest text-white font-bold border hover:text-indigo-900 hover:bg-white hover:border-indigo-900 text-center focus:outline-none"
          >
            GO
          </button>
        </motion.div>
      </div>
    </>
  );
}

export default Home;

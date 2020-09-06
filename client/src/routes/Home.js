import React from "react";
import { motion } from "framer-motion";


function Home() {
  return (
    <motion.div
      className=""
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1.5 }}
    >
      <div>Welcome to anime.io</div>
    </motion.div>
  );
};

export default Home;

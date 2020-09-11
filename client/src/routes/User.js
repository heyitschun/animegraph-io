import React from "react";
import { motion } from "framer-motion";
import { useAxiosRequest } from "../hooks/HttpRequest";
import objectMap from "../helpers/objectMap";
import Footer from "../components/Footer";


function User({ match }) {
  const user = match.params.user;
  let data = useAxiosRequest(user);
  let display = null;

  if (data.error) {
    display = <div>something went wrong</div>
  }

  if (data.loading) {
    display = <div className="mt-48 items-center flex flex-col">
      <div className="loading"><div></div><div></div><div></div></div>
        Loading...
      </div>
  }

  if (data.data) {
    let animes = [];
    objectMap(data.data, (x) => {
      animes = [...x.animes, ...animes]
    });

    display = animes.map((anime, i) => <li key={i}>
        {anime.title}
      </li>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 text-white">
        {display}
      </div>
      <Footer className="flex-shrink" />
    </div>
  );
};

export default User;

import React from "react";
import { motion } from "framer-motion";
import { useAxiosRequest } from "../hooks/HttpRequest";


function User({ match }) {
  const user = match.params.user;
  let data = useAxiosRequest(user);
  let display = null;

  if (data.error) {
    display = <div>something went wrong</div>
  }

  if (data.loading) {
    display = <div>Loading</div>
  }

  if (data.data) {
    // do stuff with data.data
    // i.e. iter over each object and extract fields that we need
    console.log(data.data)
  }

  return (
    <div className="text-white">
      <ul className="text-white">
        {display}
        <li>hello</li>
      </ul>
    </div>
  );
};

export default User;

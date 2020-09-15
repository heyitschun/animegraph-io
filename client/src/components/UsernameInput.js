import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";


function UsernameInput() {
  const history = useHistory();
  const [username, setUsername] = useState("");

  const handleChange = (e) => {
    setUsername(e.target.value);
  }

  return (
    <>
    <div className="flex w-full mx-8 md:mx-0 md:w-3/5 lg:w-2/5 flex-col md:flex-row">
      <input
        type="text"
        onChange={(e) => handleChange(e)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            history.push(`/user/${username}`);
          }
        }}
        placeholder="Your MyAnimeList username..."
        className="rounded focus:outline-none w-full md:w-4/5 p-2 font-mono text-lg text-center"
      />
      <Link to={`/user/${username}`}>
        <button
          className="transition duration-500 rounded py-2 px-5 md:ml-2 ml-0 mt-4 md:mt-0 w-full tracking-widest text-white font-bold border hover:text-indigo-900 hover:bg-white hover:border-indigo-900 text-center focus:outline-none"
        >
          GO
        </button>
      </Link>
    </div>
    </>
  );
}

export default UsernameInput;

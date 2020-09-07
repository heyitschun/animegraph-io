import React from "react";

function UsernameInput() {
  return (
    <div className="flex w-full mx-8 md:mx-0 md:w-2/5 flex-col md:flex-row">
      <input
        type="text"
        placeholder="Your MyAnimeList username..."
        className="rounded focus:outline-none w-full p-2 font-mono text-lg text-center"
      />
      <button className="transition duration-500 rounded py-2 px-5 md:ml-2 ml-0 mt-4 md:mt-0 md:w-1/5 w-full tracking-widest text-white font-bold border hover:text-indigo-900 hover:bg-white hover:border-indigo-900 text-center">
        GO
      </button>
    </div>
  );
};

export default UsernameInput;

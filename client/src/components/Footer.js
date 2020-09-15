import React from "react";

function Footer() {
  const david = 
    <a
      className="underline"
      rel="noopener noreferrer"
      href="https://github.com/dwinsung"
      target="_blank"
    >
      David Sung
    </a>;

  const chun = 
    <a
      className="underline"
      rel="noopener noreferrer"
      href="https://github.com/heyitschun"
      target="_blank"
    >
      Chun Poon
    </a>;

  return (
    <div className="text-white mt-5 mb-2 text-center text-sm font-mono">
      Copywrite <span className="text-lg">&copy;</span> 2020 | {david} & {chun}
    </div>
  );
};

export default Footer;

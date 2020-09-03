import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState("")

  const url = "/api/get-top-ten";
  
  const axiosGet = async () => {
    axios.get(url, {
      params: {
        user: username
      }
    })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const changeHandler = e => {
    setUsername(e.target.value)
  }

  return (
    <div className="App">
      <input type="text" onChange={changeHandler} className="bg-gray-200 p-5" placeholder="Enter your username..." />
      <button onClick={axiosGet} className="p-5 bg-blue-500 text-white">Get data</button>
    </div>
  );
}

export default App;

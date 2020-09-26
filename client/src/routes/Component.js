import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Component() {
  const [data, setData] = useState();
  const [points, setPoints] = useState([]);

  
  useEffect(() => {
    const URL = "/data.json";
    axios.get(URL).then(res => {
      setData(res.data);
    });
  }, []);

  let extractedPoints = [];
  if (data !== undefined) {
    // some operations on data
    setPoints(extractedPoints);
  }

  return (
    <div>{points}</div>
  )
}

export default Component;

// HistoryTab.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoryTab = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = () => {
    axios.get('/api/history') // Replace '/api/history' with your actual endpoint for fetching historical data
      .then(response => {
        setHistoryData(response.data);
      })
      .catch(error => {
        console.error('Error fetching historical data:', error);
      });
  };

  return (
    <div>
      <h2>History</h2>
      <ul>
        {historyData.map(entry => (
          <li key={entry.id}>{entry.name}</li> // Adjust the structure according to your historical data
        ))}
      </ul>
    </div>
  );
};

export default HistoryTab;

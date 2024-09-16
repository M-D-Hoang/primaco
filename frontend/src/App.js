import React, { useState, useEffect } from 'react';
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css'
import './App.css';
import TimeStamp from './TimeStamp.js';


function App() {
  const [timestamps, setTimestamps] = useState([{}]);
  const [timezones, setTimezones] = useState([]);
  const [note, setNote] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');

  // get all timezones on first render
  useEffect(() => {
    fetch('https://worldtimeapi.org/api/timezone')
      .then(response => response.json())
      .then(data => data.map(timestamp => ({ name: timestamp, value: timestamp })))
      .then(data => setTimezones(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/get-timestamps')
      .then(response => response.json())
      .then(data => setTimestamps(data))
      .catch(err => console.error(err));
  }, []);

  const storeTimestamp = () => {
    fetch('http://localhost:8080/fetch-timestamp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timezone: selectedTimezone, note: note }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Timestamp stored:', data.timestamp );
        console.log(timestamps);
        
        fetch('http://localhost:8080/get-timestamps')
          .then(response => response.json())
          .then(data => setTimestamps(data))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  };

  const handleSelectedTimezone = (value) => {
    setSelectedTimezone(value);
    console.log('Selected timezone:', selectedTimezone);
  };

  const handleDeleteAllTimestamps = () => {
    fetch('http://localhost:8080/delete-all-timestamps', {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log('All timestamps deleted:', data);
        fetch('http://localhost:8080/get-timestamps')
          .then(response => response.json())
          .then(data => setTimestamps(data))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
    console.log('Note:', note);
  };
  
  return (
    
    <div className="App">
      <h1>Store a Timestamp</h1>
      <input type="text" placeholder='Note' onChange={handleNoteChange} />

      <SelectSearch options={timezones} value={selectedTimezone} name="language" placeholder="Choose your timezone" onChange={handleSelectedTimezone} />

      <button onClick={storeTimestamp}>Store Current Timestamp</button>

      <button onClick={handleDeleteAllTimestamps}>Delete All Timestamps</button>
      <div className="timestamps">
        {timestamps.map((item, index) => (
          <TimeStamp key={index} timestamp={item.timestamp} timezone={item.timezone} note={item.note} />
        ))}
      </div>
    </div>
  );
}


export default App;

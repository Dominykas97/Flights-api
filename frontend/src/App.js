import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [averageJourneyTime, setAverageJourneyTime] = useState('')
  const [depair, setDepair] = useState('LHR')
  const [destair, setDestair] = useState('DXB')

  const fetchMessage = async () => {
    const params = { depair: depair, destair: destair };
    const urlParams = new URLSearchParams(Object.entries(params));

    await fetch('/api?' + urlParams)
      .then(res => res.json()).then(a => {
        console.log(a.average);
        setAverageJourneyTime(a.average)
      }
      )

  }
  useEffect(() => {
    fetchMessage()
  }, []);


  const onChangeHandlerDepair = event => {
    setDepair(event.target.value);
  };

  const onChangeHandlerDestair = event => {
    setDestair(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        From :<input
          type="text"
          name="name"
          onChange={onChangeHandlerDepair}
          value={depair}
        />
        To: <input
          type="text"
          name="name"
          onChange={onChangeHandlerDestair}
          value={destair}
        />

        <button onClick={fetchMessage}>Fetch average journey time</button>
        <div>{averageJourneyTime}</div>
      </header>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import './App.css';


function App() {
  const [welcomeMessage, setWelcomeMessage] = useState('')

  const fetchMessage = async () => {
    // Use Fetch API to fetch '/api' endpoint
    const message = await fetch('/api')
      .then(res => res.text()).then(a => {
        console.log(a);
        setWelcomeMessage(a)
      }
      ) // process incoming data

    // Update welcomeMessage state
    // setWelcomeMessage(message)
  }
  useEffect(() => {
    // fetchMessage()
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchMessage}>Fetch average journey time</button>
        <div>{welcomeMessage}</div>
      </header>
    </div>
  );
}

export default App;

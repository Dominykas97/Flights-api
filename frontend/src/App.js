import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [averageJourneyTime, setAverageJourneyTime] = useState('')
  const [depair, setDepair] = useState('LHR')
  const [destair, setDestair] = useState('DXB')
  const [country, setCountry] = useState('Sweden')
  const [mostPopularDayByAirport, setMostPopularDayByAirport] = useState('')
  const [countryAirports, setCountryAirports] = useState('')
  const [countryAirportsFlighsCount, setCountryAirportsFlighsCount] = useState('')
  const [depairWeekday, setDepairWeekday] = useState('MAN')
  const [flightClasses, setFlightClasses] = useState({ Business: 1 })
  const [flightsCount, setFlightsCount] = useState(1);

  const fetchAverageJourneyTime = async () => {
    const params = { depair: depair, destair: destair };
    const urlParams = new URLSearchParams(Object.entries(params));

    await fetch('/api/averageJourneyTime?' + urlParams)
      .then(res => res.json()).then(a => {
        console.log("Journey times: ", a);
        setAverageJourneyTime(a.average)
      }
      )

  }

  const fetchMostPopularDayByAirport = async () => {
    const paramsWeekday = { depair: depairWeekday };
    const urlParamsWeekday = new URLSearchParams(Object.entries(paramsWeekday));

    await fetch('/api/weekday?' + urlParamsWeekday)
      .then(res => res.json()).then(data => {
        console.log("Popularity by weekday in " + depair + " : ", data);
        if (data.count.constructor === Number) {

          const mostPopularDay = Object.keys(data.weekdays).filter(x => {
            return data.weekdays[x] === Math.max.apply(null,
              Object.values(data.weekdays));
          });
          // console.log(mostPopularDay)
          setMostPopularDayByAirport(mostPopularDay)
        } else {
          setMostPopularDayByAirport("Airport does not exist")

        }
      }
      )
  }

  const fetchCountryPopularity = async () => {
    const paramsCountry = { country: country };
    const urlParamsCountry = new URLSearchParams(Object.entries(paramsCountry));

    await fetch('/api/countrypopularity?' + urlParamsCountry)
      .then(res => res.json()).then(airports => {
        console.log("Airports in " + country + ": ", airports);
        setCountryAirportsFlighsCount(airports.count)
      }
      )
  }

  const fetchBusinessDays = async () => {
    await fetch('/api/businessDays')
      .then(res => res.json()).then((values) => {
        console.log("Flight classes: ", values)
        setFlightClasses(values.days)
        setFlightsCount(values.count)
      }
      )
  }

  useEffect(() => {
    fetchAverageJourneyTime();
    fetchMostPopularDayByAirport();
    fetchBusinessDays()
    fetchCountryPopularity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onChangeHandlerDepair = event => {
    setDepair(event.target.value);
  };

  const onChangeHandlerDestair = event => {
    setDestair(event.target.value);
  };


  const onChangeHandlerDepairWeekday = event => {
    setDepairWeekday(event.target.value);
  };

  const onChangeHandlerCountry = event => {
    setCountry(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          Departure:{" "}
          <input
            type="text"
            name="name"
            onChange={onChangeHandlerDepair}
            value={depair}
          />
        </div>
        <div>

          Arrival:{" "}
          <input
            type="text"
            name="name"
            onChange={onChangeHandlerDestair}
            value={destair}
          />
        </div>
        <button className="button" onClick={fetchAverageJourneyTime}>Fetch average journey time</button>
        <div className="result">{averageJourneyTime}</div>

          From :<input
          type="text"
          name="name"
          onChange={onChangeHandlerDepairWeekday}
          value={depairWeekday}
        />
        <button className="button" onClick={fetchMostPopularDayByAirport}>Fetch most popular airport day</button>
        <div className="result">{mostPopularDayByAirport}</div>

        <button className="button" onClick={fetchBusinessDays}>Fetch bussiness flights' percentage</button>
        <div className="result"> {flightsCount !== 1 ? (flightClasses.Business / flightsCount * 100).toFixed(2) + "%" : null}</div>


        Country:<input
          type="text"
          name="name"
          onChange={onChangeHandlerCountry}
          value={country}
        />
        <div></div>
        <button className="button" onClick={fetchCountryPopularity}>Fetch percentage of total flights to this country</button>
        <div className="result">{flightsCount !== 1
          ? (countryAirportsFlighsCount !== "This country does not exist."
            ? (countryAirportsFlighsCount / flightsCount * 100).toFixed(2) + "% "
            : '')
          + "(" + countryAirportsFlighsCount + ")" : null}</div>
      </header>
    </div>
  );
}

export default App;

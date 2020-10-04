import React, { useEffect, useState } from 'react';
import './App.css';
import { FormattedNumber } from "react-intl";

function App() {
  const [averageJourneyTime, setAverageJourneyTime] = useState('')
  const [depair, setDepair] = useState('LHR')
  const [destair, setDestair] = useState('DXB')
  const [country, setCountry] = useState('United Kingdom')
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
        console.log(a);
        setAverageJourneyTime(a.average)
      }
      )

  }

  const fetchMostPopularDayByAirport = async () => {
    const paramsWeekday = { depair: depairWeekday };
    const urlParamsWeekday = new URLSearchParams(Object.entries(paramsWeekday));

    await fetch('/api/weekday?' + urlParamsWeekday)
      .then(res => res.json()).then(data => {
        console.log(data);
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
      .then(res => res.json()).then(a => {
        console.log(a);
        setCountryAirportsFlighsCount(a.count)
      }
      )
  }

  const fetchBusiness = async () => {
    // const params = { depair: depair, destair: destair };
    // const urlParams = new URLSearchParams(Object.entries(params));

    await fetch('/api/businessDays')
      .then(res => res.json()).then((values) => {
        // console.log(Object.values(a));
        // console.log(values)
        setFlightClasses(values.days)
        setFlightsCount(values.count)
        // console.log(flightClasses)
      }
      )
  }

  useEffect(() => {
    fetchAverageJourneyTime();
    fetchMostPopularDayByAirport();
    fetchCountryPopularity();
    // fetchBusiness()
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
        <button onClick={fetchAverageJourneyTime}>Fetch average journey time</button>
        <div>{averageJourneyTime}</div>

        From :<input
          type="text"
          name="name"
          onChange={onChangeHandlerDepairWeekday}
          value={depairWeekday}
        />
        <button onClick={fetchMostPopularDayByAirport}>Fetch most popular airport day</button>
        <div>{mostPopularDayByAirport}</div>

        <button onClick={fetchBusiness}>Fetch bussiness flights' percentage</button>
        <div> {flightsCount !== 1 ? (flightClasses.Business / flightsCount * 100).toFixed(2) + "%" : null}</div>


        From :<input
          type="text"
          name="name"
          onChange={onChangeHandlerCountry}
          value={country}
        />
        <button onClick={fetchCountryPopularity}>Fetch country</button>
        <div>{countryAirportsFlighsCount}</div>

      </header>
    </div>
  );
}

export default App;

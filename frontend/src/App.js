import React, { useEffect, useState } from 'react';
import './App.css';
import { FormattedNumber } from "react-intl";

function App() {
  const [averageJourneyTime, setAverageJourneyTime] = useState('')
  const [depair, setDepair] = useState('LHR')
  const [destair, setDestair] = useState('DXB')
  const [mostPopularDayByAirport, setMostPopularDayByAirport] = useState('')
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
      .then(res => res.json()).then(a => {
        console.log(a);
        const mostPopularDay = Object.keys(a).filter(x => {
          return a[x] === Math.max.apply(null,
            Object.values(a));
        });
        // };
        console.log(mostPopularDay)
        // Object.values(obj);
        setMostPopularDayByAirport(mostPopularDay)
      }
      )
  }

  const fetchBusiness = async () => {
    // const params = { depair: depair, destair: destair };
    // const urlParams = new URLSearchParams(Object.entries(params));

    await fetch('/api/businessDays')
      .then(res => res.json()).then((values) => {
        // console.log(Object.values(a));
        console.log(values)
        setFlightClasses(values.days)
        // setAverageJourneyTime(a)
        setFlightsCount(values.count)
        //   setFlighingClasses((prevState) => ({
        //     ...prevState,
        //     [event.target.id]: event.target.value
        //  }));
        // return values;
        console.log(flightClasses)
      }

      )
    // .then(
    // () => console.log(flightClasses))


  }

  useEffect(() => {
    fetchAverageJourneyTime();
    fetchMostPopularDayByAirport();
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
      </header>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './App.css';

function App() {
  const [averageJourneyTime, setAverageJourneyTime] = useState('')
  const [depair, setDepair] = useState('LHR')
  const [destair, setDestair] = useState('DXB')
  const [country, setCountry] = useState('Sweden')
  const [mostPopularDayByAirport, setMostPopularDayByAirport] = useState('')
  const [countryAirportsFlighsCount, setCountryAirportsFlighsCount] = useState('')
  const [depairWeekday, setDepairWeekday] = useState('MAN')
  const [flightClasses, setFlightClasses] = useState({ Business: 1 })
  const [flightsCount, setFlightsCount] = useState(1);
  const [highestPriceCarrier, setHighestPriceCarrier] = useState(0);
  const [highestPriceCarrierPrice, setHighestPriceCarrierPrice] = useState(0);

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
        setFlightClasses(values.classes)
        setFlightsCount(values.count)
      }
      )
  }

  const fetchPrices = async () => {
    await fetch('/api/prices')
      .then(res => res.json()).then((values) => {
        console.log("Prices: ", values)

        const averagePrices = []
        Object.values(values.carriersPrices).forEach(function (carrier) {
          averagePrices.push(carrier.averageInGBP)
        })
        const highestPriceCarrier = Object.keys(values.carriersPrices).filter(x => {
          return values.carriersPrices[x].averageInGBP === Math.max.apply(null,
            averagePrices);
        })
        setHighestPriceCarrier(highestPriceCarrier)
        setHighestPriceCarrierPrice(values.carriersPrices[highestPriceCarrier].averageInGBP)
      })
  }

  useEffect(() => {
    fetchAverageJourneyTime();
    fetchMostPopularDayByAirport();
    fetchBusinessDays()
    fetchCountryPopularity();
    fetchPrices();
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
        <Container>
          <Row className="box">
            <Col>
              Departure airport:{" "}
              <input
                type="text"
                name="name"
                onChange={onChangeHandlerDepair}
                value={depair}
              />
            </Col>
            <Col>
              Arrival airport:{" "}
              <input
                type="text"
                name="name"
                onChange={onChangeHandlerDestair}
                value={destair}
              />
            </Col>
            <Col>
              <button className="button" onClick={fetchAverageJourneyTime}>Fetch average journey time</button>
            </Col>
            <Col>
              <div className="result">{averageJourneyTime}</div>
            </Col>
          </Row>
          <Row className="box">
            <Col>
              From airport:{" "}
              <input
                type="text"
                name="name"
                onChange={onChangeHandlerDepairWeekday}
                value={depairWeekday}
              />
            </Col>
            <Col>
              <button className="button" onClick={fetchMostPopularDayByAirport}>Fetch most popular airport day</button>
            </Col>
            <Col>
              <div className="result">{mostPopularDayByAirport}</div>
            </Col>
          </Row>
          <Row className="box">
            <Col>
              <button className="button" onClick={fetchBusinessDays}>Fetch bussiness flights' percentage</button>
            </Col>
            <Col>
              <div className="result"> {flightsCount !== 1 ? (flightClasses.Business / flightsCount * 100).toFixed(2) + "%" : null}</div>
            </Col>
          </Row>
          <Row className="box">
            <Col>
              Country:{" "}
              <input
                type="text"
                name="name"
                onChange={onChangeHandlerCountry}
                value={country}
              />
            </Col>
            <Col>
              <button className="button" onClick={fetchCountryPopularity}>Fetch % of total flights to this country</button>
            </Col>
            <Col>
              <div className="result">{flightsCount !== 1
                ? (countryAirportsFlighsCount !== "This country does not exist."
                  ? (countryAirportsFlighsCount / flightsCount * 100).toFixed(2) + "% "
                  : '')
                + "(" + countryAirportsFlighsCount + ")" : null}
              </div>
            </Col>
          </Row>

          <Row className="box">
            <Col>
              <button className="button" onClick={fetchPrices}>Fetch highest average cost airline</button>
            </Col>
            <Col>
              <div className="result"> {highestPriceCarrier !== 0 ? (highestPriceCarrier + ": £" + highestPriceCarrierPrice) : null}</div>
            </Col>
          </Row>

        </Container>
      </header>
    </div>
  );
}

export default App;

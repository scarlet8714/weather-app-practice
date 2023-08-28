import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import logo from './logo.svg';
// import './App.css';
import styled from '@emotion/styled';
// import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
// import WeatherIcon from './components/WeatherIcon';
// import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
// import { ReactComponent as RainIcon } from './images/rain.svg';
// import { ReactComponent as RefreshIcon } from './images/refresh.svg';
// import { ReactComponent as LoadingIcon } from './images/loading.svg';
import { ThemeProvider } from '@emotion/react';
// import dayjs from 'dayjs';
import { getMoment } from './utils/helpers';
import WeatherCard from './views/WeatherCard';
import useWeatherAPI from './hooks/useWeatherAPI';

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// const fetchWeatherForecast = () => {
//   return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${API_KEY}&locationName=${LOCATION_FORECAST}`)
//   .then((response) => response.json())
//   .then((data) => {
//     const locationData = data.records.location[0];
//     const weatherElements = locationData.weatherElement.reduce(
//       (ne, item) => {
//         if(['Wx', 'PoP', 'CI'].includes(item.elementName)) {
//           if(item.elementName == 'Wx') {
//             ne[item.elementName] = item.time[0].parameter.parameterName;
//             ne['weatherCode'] = item.time[0].parameter.parameterValue;
//           } else{
//             ne[item.elementName] = item.time[0].parameter.parameterName;
            
//           }
//         }
//         return ne;
//       }, {}
//     )
//     return {
//       description: weatherElements.Wx,
//       rainPossibility: weatherElements.PoP,
//       comfortability: weatherElements.CI,
//       weatherCode: weatherElements.weatherCode
//     }
//   })

// }

// const fetchCurrentWeather = () => {
//   return fetch(
//     `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${API_KEY}&locationName=${LOCATION_NAME}`
//   )
//   .then((response) => response.json())
//   .then((data) => {
//     const locationData = data.records.location[0];
//     const weatherElements = locationData.weatherElement.reduce(
//       (neededElements, item) => {
//         if(['WDSD', 'TEMP'].includes(item.elementName)) {
//           neededElements[item.elementName] = item.elementValue;
//         }
//         return neededElements;
//       }, {}
//     )
    
//     return {
//       locationName: locationData.locationName,
//       observationTime: locationData.time.obsTime,
//       temperature: weatherElements.TEMP,
//       windSpeed: weatherElements.WDSD,
//     }
//   })
// }

const API_KEY = 'CWB-8ED81A9B-1232-4137-B7A3-C3E6E4F91A5C';
const LOCATION_NAME = '臺北';
const LOCATION_FORECAST = '臺北市';

function App() {
  const[currentTheme, setCurrentTheme] = useState('light');
  // const[currentWeather, setCurrentWeather] = useState({
  //   locationName: '',
  //   description: '',
  //   windSpeed: 0,
  //   temperature: 0,
  //   weatherCode: 0,
  //   comfortability: '',
  //   rainPossibility: 0,
  //   observationTime: new Date(),
  //   isLoading: true
  // });

  const moment = useMemo(() => getMoment(LOCATION_FORECAST), []);
  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark')
  }, [moment]);
  // const fetchdata = useCallback(async () => {
  //   setCurrentWeather((prevState) => ({
  //     ...prevState,
  //     isLoading: true
  //   }))
  //   const[cw, wf] = await Promise.all(
  //     [
  //       fetchCurrentWeather(),
  //       fetchWeatherForecast()
  //     ]
  //   )
  //   setCurrentWeather({
  //     ...cw,
  //     ...wf,
  //     isLoading: false
  //   })
  // }, [])
  // useEffect(()=> {
  //   fetchdata();
  // }, []);
  // useEffect(() => {
  //   console.log(currentWeather);
  // }, [currentWeather]);
  const[currentWeather, fetchdata] = useWeatherAPI({
    authorizationKey: API_KEY,
    cityName: LOCATION_FORECAST,
    locationName: LOCATION_NAME
  })
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard 
          currentWeather={currentWeather}
          moment={moment}
          fetchdata={fetchdata}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;

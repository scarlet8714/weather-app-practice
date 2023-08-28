import React, { useCallback, useEffect, useState } from 'react';
// import logo from './logo.svg';
// import './App.css';
import styled from '@emotion/styled';
// import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import WeatherIcon from './components/WeatherIcon';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import { ReactComponent as LoadingIcon } from './images/loading.svg';
import { ThemeProvider } from '@emotion/react';
import dayjs from 'dayjs';

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

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

// const DayCloudy = styled(DayCloudyIcon)`
//   flex-basis: 30%;
// `;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    @keyframes rotate {
      from {
        transform: rotate(360deg);
      }
      to {
        transform: rotate(0deg);
      }
    }
    animation: rotate infinite ${({isLoading}) => (isLoading ? '1.5s' : '0s')} linear;
  }
`;

const fetchWeatherForecast = () => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${API_KEY}&locationName=${LOCATION_FORECAST}`)
  .then((response) => response.json())
  .then((data) => {
    const locationData = data.records.location[0];
    const weatherElements = locationData.weatherElement.reduce(
      (ne, item) => {
        if(['Wx', 'PoP', 'CI'].includes(item.elementName)) {
          if(item.elementName == 'Wx') {
            ne[item.elementName] = item.time[0].parameter.parameterName;
            ne['weatherCode'] = item.time[0].parameter.parameterValue;
          } else{
            ne[item.elementName] = item.time[0].parameter.parameterName;
            
          }
        }
        return ne;
      }, {}
    )
    return {
      description: weatherElements.Wx,
      rainPossibility: weatherElements.PoP,
      comfortability: weatherElements.CI,
      weatherCode: weatherElements.weatherCode
    }
  })

}

const fetchCurrentWeather = () => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${API_KEY}&locationName=${LOCATION_NAME}`
  )
  .then((response) => response.json())
  .then((data) => {
    const locationData = data.records.location[0];
    const weatherElements = locationData.weatherElement.reduce(
      (neededElements, item) => {
        if(['WDSD', 'TEMP'].includes(item.elementName)) {
          neededElements[item.elementName] = item.elementValue;
        }
        return neededElements;
      }, {}
    )
    
    return {
      locationName: locationData.locationName,
      observationTime: locationData.time.obsTime,
      temperature: weatherElements.TEMP,
      windSpeed: weatherElements.WDSD,
    }
  })
}

const API_KEY = 'CWB-8ED81A9B-1232-4137-B7A3-C3E6E4F91A5C';
const LOCATION_NAME = '臺北';
const LOCATION_FORECAST = '臺北市';

function App() {
  const[currentTheme, setCurrentTheme] = useState('light');
  const[currentWeather, setCurrentWeather] = useState({
    locationName: '',
    description: '',
    windSpeed: 0,
    temperature: 0,
    weatherCode: 0,
    comfortability: '',
    rainPossibility: 0,
    observationTime: new Date(),
    isLoading: true
  });
  const {
    observationTime,
    description,
    locationName,
    windSpeed,
    temperature,
    rainPossibility,
    isLoading,
    comfortability
  } = currentWeather;
  
  const fetchdata = useCallback(async () => {
    setCurrentWeather((prevState) => ({
      ...prevState,
      isLoading: true
    }))
    const[cw, wf] = await Promise.all(
      [
        fetchCurrentWeather(),
        fetchWeatherForecast()
      ]
    )
    setCurrentWeather({
      ...cw,
      ...wf,
      isLoading: false
    })
  }, [])
  useEffect(()=> {
    fetchdata();
  }, []);
  useEffect(() => {
    console.log(currentWeather);
  }, [currentWeather]);
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard>
          <Location>{locationName}</Location>
          <Description>{description + ' '} {comfortability}</Description>
          <CurrentWeather>
            <Temperature>
              {temperature}<Celsius>°C</Celsius>
            </Temperature>
            <WeatherIcon />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon /> {windSpeed} m/h
          </AirFlow>
          <Rain>
            <RainIcon />  {rainPossibility}%
          </Rain>
          <Refresh onClick={fetchdata} isLoading={isLoading}>
            最後觀測時間 : {new Intl.DateTimeFormat('zh-TW', {
              hour: 'numeric',
              minute: 'numeric'
            }).format(dayjs(observationTime))}{' '} {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;

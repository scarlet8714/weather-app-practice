import {useState, useEffect, useCallback} from 'react';
import { getMoment } from './../utils/helpers';

const useWeatherAPI = ({locationName, cityName, authorizationKey}) => {
    // const[currentTheme, setCurrentTheme] = useState('light');
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
  const fetchWeatherForecast = ({authorizationKey, cityName}) => {
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
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
  
  const fetchCurrentWeather = ({locationName, authorizationKey}) => {
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
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

//   const moment = useMemo(() => getMoment(cityName), []);
//   useEffect(() => {
//     setCurrentTheme(moment === 'day' ? 'light' : 'dark')
//   }, [moment]);
  const fetchdata = useCallback(async () => {
    setCurrentWeather((prevState) => ({
      ...prevState,
      isLoading: true
    }))
    const[cw, wf] = await Promise.all(
      [
        fetchCurrentWeather({locationName, authorizationKey}),
        fetchWeatherForecast({authorizationKey, cityName})
      ]
    )
    setCurrentWeather({
      ...cw,
      ...wf,
      isLoading: false
    })
  }, [locationName, cityName, authorizationKey])
  useEffect(()=> {
    fetchdata();
  }, []);
  return [currentWeather, fetchdata];
}

export default useWeatherAPI;
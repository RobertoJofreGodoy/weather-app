import { formatDate, formatTemp } from "./utils/format-data.js"
import { weatherConditionsCodes } from "./constants.js"
import { getLatitudeLongitude } from "./geolocation.js"
import { getCurrentWeather } from "./services/weather.js"

function setCurrentCity($element, city) {
  $element.textContent = city
}

function setCurrentDate($element) {
  const date = new Date()
  const formatedDate = formatDate(date)
  $element.textContent = formatedDate
}

function setCurrentTemp($element, temp) {
  $element.textContent = formatTemp(temp)
}

function solarStatus(sunriseTime, sunsetTime) {
  const currentHours = new Date().getHours()
  const sunriseHours = sunriseTime.getHours()
  const sunsetHours = sunsetTime.getHours()

  if (currentHours > sunsetHours || currentHours < sunriseHours) {
    return "night"
  }
  return "morning"
}

function setBackground($element, conditionCode, solarStatus) {
  const weatherType = weatherConditionsCodes[conditionCode]
  const size = window.matchMedia("(-webkit-min-device-pixel-ratio: 2)").matches
    ? "@2x"
    : ""
  $element.style.backgroundImage = `url(./images/${solarStatus}-${weatherType}${size}.jpg)`
}

function showCurrentWeather($app, $loader) {
  $app.hidden = false
  $loader.hidden = true
}

function configCurrentWeather(weather) {
  // date
  const $currentWeatherDate = document.querySelector("#current-weather-date")
  setCurrentDate($currentWeatherDate)

  // city
  const $currentWeatherCity = document.querySelector("#current-weather-city")
  const city = weather.name
  setCurrentCity($currentWeatherCity, city)

  // temp
  const $currentWeatherTemp = document.querySelector("#current-weather-temp")
  const temp = weather.main.temp
  setCurrentTemp($currentWeatherTemp, temp)

  // backbround
  const sunriseTime = new Date(weather.sys.sunrise * 1000)
  const sunsetTime = new Date(weather.sys.sunset * 1000)
  const conditionCode = String(weather.weather[0].id).charAt(0)
  const $app = document.querySelector("#app")

  setBackground($app, conditionCode, solarStatus(sunriseTime, sunsetTime))

  // loader
  const $loading = document.querySelector("#loading")
  showCurrentWeather($app, $loading)
}

export async function currentWeather() {
  const { latitude, longitude, isError } = await getLatitudeLongitude()

  if (isError) {
    return console.error("ha ocurrido un error")
  }

  const { isError: currentWeatherError, data: weather } =
    await getCurrentWeather(latitude, longitude)
  if (currentWeatherError) {
    return console.error("ha ocurrido un error con la API")
  }
  return weather
}

export async function startConfigCurrentWeather(){
  const weather = await currentWeather()
  configCurrentWeather(weather)

}
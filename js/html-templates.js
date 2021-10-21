import { createDom } from "./utils/dom.js"
import { formatDate, formatTemp } from "./utils/format-data.js"

function tabPanelTemplate(id) {
  return `
      <div class="tabPanel" tabindex="0" aria-labelledby="tab-${id}">
      <div class="dayWeather" id="dayWeather-${id}">
        <ul class="dayWeather-list" id="dayWeather-list-${id}">
          
        </ul>
      </div>
    </div>
      `
}

function periodTimeTemplate({ temp, date, dateId, icon, description }) {
  return `
      <li class="dayWeather-item" id=${dateId}>
      <span class="dayWeather-time">${date}</span>
      <img
        class="dayWeather-icon"
        height="48"
        width="48"
        src="https://openweathermap.org/img/wn/${icon}@2x.png"
        alt=${description}
        rain=""
      />
      <span class="dayWeather-temp">${temp}</span>
    </li>
      `
}

function currentPeriodTimeTemplate({ temp, icon, description }) {
  return `
      <li class="dayWeather-item is-selected" id="current-dayWeather-item">
      <span class="dayWeather-time">Ahora</span>
      <img
        class="dayWeather-icon"
        height="48"
        width="48"
        src="https://openweathermap.org/img/wn/${icon}@2x.png"
        alt=${description}
        rain=""
      />
      <span class="dayWeather-temp">${temp}</span>
    </li>
      `
}

function weatherMertricsTemplate({ tempMax, tempMin, humidity, windSpeed }) {
  return `
   <div class="weatherMetrics">
    <span>Máx: <strong>${tempMax}</strong></span>
    <span>Min: <strong>${tempMin}</strong></span>
    <span>Viento: <strong>${windSpeed} Km-h</strong></span>
    <span>Humedad: <strong>${humidity}%</strong></span>
   </div>
  `
}

export function createWeatherMetrics(weather) {
  const $weatherMetrics = document.querySelector(".weatherMetrics")

  if ($weatherMetrics) {
    $weatherMetrics.parentNode.removeChild($weatherMetrics)
  }

  const tempMax = formatTemp(weather.main.temp_max)
  const tempMin = formatTemp(weather.main.temp_min)

  const data = {
    tempMax,
    tempMin,
    humidity: weather.main.humidity,
    windSpeed: weather.wind.speed,
  }

  return createDom(weatherMertricsTemplate(data))
}

export function createTabPanel(id) {
  const $panel = createDom(tabPanelTemplate(id))
  if (id > 0) {
    $panel.hidden = true
  }
  return $panel
}

export function createPeriodTime(weather) {
  const dateOptions = {
    hour: "numeric",
    hour12: true,
  }
  const temp = formatTemp(weather.main.temp)
  const date = formatDate(weather.dt * 1000, dateOptions)

  const config = {
    temp,
    date,
    dateId: weather.dt,
    icon: weather.weather[0].icon,
    description: weather.weather[0].description,
  }

  return createDom(periodTimeTemplate(config))
}
export function createCurrentPeriodTime(weather) {
  const temp = formatTemp(weather.main.temp)

  const config = {
    temp,
    icon: weather.weather[0].icon,
    description: weather.weather[0].description,
  }

  return createDom(currentPeriodTimeTemplate(config))
}

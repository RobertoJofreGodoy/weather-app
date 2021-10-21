import { getWeeklytWeather } from "./services/weather.js"
import { currentWeather } from "./current-weather.js"
import { getLatitudeLongitude } from "./geolocation.js"
import { formatWeekList } from "./utils/format-data.js"
import {
  createTabPanel,
  createPeriodTime,
  createCurrentPeriodTime,
  createWeatherMetrics,
} from "./html-templates.js"
import { draggable } from "./draggable.js"

let weatherList = []

async function configWeeklyWeather(weeklist) {
  const $container = document.querySelector(".tabs")
  const todayWeather = await currentWeather()

  return new Promise((resolve, reject) => {
    let counter = 0
    weeklist.forEach((day, index) => {
      const $panel = createTabPanel(index)
      $container.append($panel)
      const $tabTodayPanel = document.querySelector(`[aria-labelledby="tab-0"]`)

      const $currentDayWeatherItem = document.querySelector(
        "#current-dayWeather-item"
      )
      if (!$currentDayWeatherItem) {
        $tabTodayPanel
          .querySelector(".dayWeather-list")
          .append(createCurrentPeriodTime(todayWeather))
      }
      day.forEach((weather, indexWeather) => {
        $panel
          .querySelector(".dayWeather-list")
          .append(createPeriodTime(weather))
      })
      counter++
      
    })
    console.log(`se ha ejecutado ${counter} veces`)
    resolve(true)
  })
}

export default async function weeklytWeather() {
  const $container = document.querySelector(".weeklyWeather")

  const { latitude, longitude, isError } = await getLatitudeLongitude()
  if (isError) console.error("ha ocurrido un error")

  const { isError: weeklyWeatherError, data: weather } =
    await getWeeklytWeather(latitude, longitude)
  if (weeklyWeatherError) {
    return console.error("ha ocurrido un error con la API")
  }
  const weeklist = formatWeekList(weather.list)
  weatherList = weather.list
  
  configWeeklyWeather(weeklist).then(() => {
    mapDayWeatherList()
    .then( () => {
      draggable($container)
    })
  })
}

async function mapDayWeatherList() {
  const todayWeather = await currentWeather()

  const $container = document.querySelector("#tabs")
  const $dayWeatherList = $container.querySelectorAll(".dayWeather-item")
  const $weeklyWeather = document.querySelector('.weeklyWeather')

  $dayWeatherList.forEach(($dayWeather, index) => {
    $dayWeather.addEventListener("click", handleSelectDayWeatherClick, true)
  })

  $weeklyWeather.append(createWeatherMetrics(todayWeather))

  function handleSelectDayWeatherClick(event) {
    console.log(event)

    const $dayWeatherSelected = event.currentTarget

    console.log(event.currentTarget.id)

    if (event.currentTarget.id === 'current-dayWeather-item') {
      $weeklyWeather.append(createWeatherMetrics(todayWeather))
    } else {
      const dayWeather = weatherList.filter( (weather) => weather.dt === Number(event.currentTarget.id))
 
      $weeklyWeather.append(createWeatherMetrics(dayWeather[0]))
    }

    const $dayWeatherActive = document.querySelector(".is-selected")
    $dayWeatherActive.classList.remove("is-selected")
    $dayWeatherSelected.classList.add("is-selected")

  }
}
 

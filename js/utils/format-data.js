const defaultDateOptions = {
  day: "numeric",
  weekday: "long",
  month: "long",
}

export function formatDate(date, options = defaultDateOptions) {
  return new Intl.DateTimeFormat("es", options).format(date)
}

export function formatTemp(temp) {
  return `${Math.floor(temp)}º`
}

export function formatWeekList(rawData) {
  const today = new Date()
  const todayDay = today.getDay()
  let day = todayDay

  const weekList = []
  let dayList = []

  rawData.map((item) => {
    const itemDate = new Date(item.dt * 1000)
    const itemDay = itemDate.getDay()

    if (itemDay > day) {
      weekList.push(dayList)
      dayList = []
      day++
    }
    if (itemDay === 0 && day === 6) {
      weekList.push(dayList)
      dayList = []
      day = 0
    }
    dayList.push(item)
  })

  weekList.push(dayList)

  return weekList
}

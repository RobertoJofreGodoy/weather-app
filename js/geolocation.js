const geolocationSupport = () => "geolocation" in navigator

const defaultOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 1000000,
}

export function getCurrentPosition(options = defaultOptions) {
  if (!geolocationSupport()) {
    throw new Error("No hay soporte de geolocalización en tu navegador")
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        resolve(position)
      },
      () => {
        reject(new Error("no se ha podido obtener ubicación"))
      },
      options
    )
  })
}

export async function getLatitudeLongitude(options = defaultOptions) {
    try {
        const { coords: { latitude, longitude },} = await getCurrentPosition(options)
        return { latitude, longitude, isError: false }
        
    } catch (error) {
        return { isError: true, latitude: null, longitude: null }
    }
}

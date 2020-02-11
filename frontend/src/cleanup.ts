async function removeAllServiceWorkers () {
  if (navigator.serviceWorker) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    registrations.forEach(registration => {
      registration.unregister()
    })
  }
}

export async function cleanup () {
  return Promise.all([
    removeAllServiceWorkers(),
  ])
}

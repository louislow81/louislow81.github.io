/*
  Krunch Asynchronous Environment for routing, mouting and
  enable the build-in utilities.
*/
(async function main() {

  // Routing
  // Isomorphic urls routing api.
  // krunch.register('router', route.Router)
  // krunch.register('route', route.Route)

  // krunch.probeConnection() // check connection
  // krunch.networkSpeed() // show network properties

  await krunch.compile() // init compiler

  // add critical assets
  // into Cache Storage
  const assets = [
    // lottiefiles
    'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
    'https://assets9.lottiefiles.com/packages/lf20_ed9D2z.json'
  ]
  krunch.addCache(assets)

  // `card-cookies-consent` is a master controller mount
  // components only after accepting the cookies consent.
  const components = 'card-cookies-consent'
  krunch.mount(components) // mount components

}())

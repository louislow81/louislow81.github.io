/*
  Krunch Asynchronous Environment for routing, mouting and
  enable the build-in utilities.
*/
(async function main() {

  krunch.probeConnection() // check connection
  krunch.networkSpeed() // show network properties
  progressbar.pageRead() // show reading progress

  await krunch.compile() // init compiler

  // add critical assets
  // into Cache Storage
  const assets = [
    'https://loouislow81.github.io/old/assets/pdf/loouislow_resume_10_jan_2020.pdf'
  ]
  krunch.addCache(assets)

  // `card-cookies-consent` is a master controller mount
  // components only after accepting the cookies consent.
  const components = 'card-cookies-consent'
  krunch.mount(components) // mount components

}())
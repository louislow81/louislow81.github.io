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
  progressbar.pageRead() // show reading progress

  await krunch.compile() // init compiler

  // add critical assets
  // into Cache Storage
  const assets = [
    'https://loouislow81.github.io/old/assets/pdf/loouislow_resume_10_jan_2020.pdf',
    // Drift
    'https://js.driftt.com/deploy/assets/index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css',
    'https://driftt.imgix.net/https%3A%2F%2Fdriftt.imgix.net%2Fhttps%253A%252F%252Fs3.amazonaws.com%252Fcustomer-api-avatars-prod%252F143025%252Fd74fd385e545499b4199612f8f3271abazeu45xncm6n%3Ffit%3Dmax%26fm%3Dpng%26h%3D200%26w%3D200%26s%3D618df2d1becd817272750d418c8b612a?fit=max&fm=png&h=200&w=200&s=f8df938f30bececc2631946e17b48633',
    'https://js.driftt.com/deploy/assets/assets/vendors-AwayMessage-LiveAudienceMessagePreview-ProductAnnouncementWelcomeMessage-WelcomeMessage-mess-e915d62e-7fe953248f449bcfb50d.js',
    'https://js.driftt.com/deploy/assets/assets/ProductAnnouncementWelcomeMessage-5a2aaa591e5640330e4b.js',
    // Twitter
    'https://pbs.twimg.com/profile_images/977770118234062848/yjD37ySD_normal.jpg',
    'https://platform.twitter.com/js/timeline.d228dcf3573461f298b082c9a5c0a42c.js',
    'https://platform.twitter.com/js/moment~timeline~tweet.99ce5e0e4617985354c5c426d7e1b9f4.js'
  ]
  krunch.addCache(assets)

  // `card-cookies-consent` is a master controller mount
  // components only after accepting the cookies consent.
  const components = 'card-cookies-consent'
  krunch.mount(components) // mount components

}())
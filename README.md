# My Porfolio Website

> [https://loouislow81.github.io](https://loouislow81.github.io)

---

### _prototype

The UI prototyping is done with my in-house prorietary design tool, it's called ~ [Kraft](https://kraft.netlify.app).

<p align="left">
  <img src="assets/mockup_01.png" width="100%" height="auto">
</p>

### _screenshots

<p align="left">
  <img src="assets/screenshot_01.png" width="50%" height="auto">
  <img src="assets/screenshot_02.png" width="50%" height="auto">
  <img src="assets/screenshot_03.png" width="50%" height="auto">
  <img src="assets/screenshot_04.png" width="50%" height="auto">
  <img src="assets/screenshot_05.png" width="50%" height="auto">
  <img src="assets/screenshot_06.png" width="50%" height="auto">
  <img src="assets/screenshot_07.png" width="50%" height="auto">
  <img src="assets/screenshot_08.png" width="50%" height="auto">
</p>

### _development

The project is using my in-house proprietary development tools: Model-View-Presenter framework is [KrugurtJS](https://github.com/loouislow81/krugurt) to create functional web components with API callbacks, and the styling is a low-level CSS framework ~ [Yogurt CSS](https://yogurtcss.netlify.app).

Some contents are live feeding from [Twitter](https://twitter.com/loouislow) account by embedding the widget and the articles are from [DEV](https://dev.to/loouislow) by fetching API. The rest of the contents are JSON serves locally.

The website user experience benefits from the `krugurt.js` MVP framework that has PWA on-demand-caching and an adaptive image loader (load either low/high quality images depends on connection speeds) mechas. Also benefit from the `yogurt.css` framework by using `render` utilities on the selected elements, which the web browser viewport only renders when the user is viewing it, elements that are off-screen would not be rendered, which vastly improve page load and rendering time.

Grab a repo and installing necessary packages,

```bash
$ git clone --branch 2.x.x https://github.com/loouislow81/loouislow81.github.io.git
# YARN
$ yarn
# NPM
$ npm i
```

For development mode,

```bash
# YARN
$ yarn build-dev
# NPM
$ npm run build-dev
```

For production mode,

```bash
# YARN
$ yarn build-prod
# NPM
$ npm run build-prod
```

Enjoy!


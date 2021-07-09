[![Netlify Status](https://api.netlify.com/api/v1/badges/63ee7e9f-e651-4ad1-b055-82bc1b31cf8b/deploy-status)](https://app.netlify.com/sites/louislow/deploys)

# My Portfolio Website

> [https://louislow81.github.io](https://louislow81.github.io)

---

### _prototype

<p align="left">
  <img src="assets/mockup_01.png" width="100%" height="auto">
</p>

### _screenshots

<p align="left">
  <img src="assets/screenshot_01.png" width="49%" height="auto">
  <img src="assets/screenshot_02.png" width="49%" height="auto">
  <img src="assets/screenshot_03.png" width="49%" height="auto">
  <img src="assets/screenshot_04.png" width="49%" height="auto">
  <img src="assets/screenshot_05.png" width="49%" height="auto">
  <img src="assets/screenshot_06.png" width="49%" height="auto">
  <img src="assets/screenshot_07.png" width="49%" height="auto">
  <img src="assets/screenshot_08.png" width="49%" height="auto">
</p>

### _content

- About
- Projects
- Blog
- Article
- Experience
- Skills
- Contact

### _terminal

view resume in Terminal,

```bash
$ npx loouislow-resume
```

### _development

The project is using my in-house proprietary development tools: Model-View-Presenter framework is [KrugurtJS](https://github.com/louislow81/krugurt) to create functional web components with API callbacks, and the styling is a low-level CSS framework ~ [Yogurt CSS](https://yogurtcss.netlify.app).

Some contents are live feeding from [Twitter](https://twitter.com/louislow) account by embedding the widget and the articles are from [DEV](https://dev.to/louislow) by fetching API. The rest of the contents are JSON serves locally.

The website user experience benefits from the `krugurt.js` MVP framework that has PWA on-demand-caching and an adaptive image loader (load either low/high quality images depends on connection speeds) mechas. Also benefit from the `yogurt.css` framework by using `render` utilities on the selected elements, which the web browser viewport only renders when the user is viewing it, elements that are off-screen would not be rendered, which vastly improve page load and rendering time.

### _screens

Responsive screens support for mobile, laptop `1k` and, large screen size `2k`.

### _build

Grab a repo and installing necessary packages,

```bash
$ git clone --branch 2.x.x https://github.com/louislow81/louislow81.github.io.git
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

> Those who are using the opensource tool that I created. Brings happiness, eliminate troubles, and plant the seeds of Buddha, after all, they are free from suffering. Namo Amitabha. 凡是用了我所创造的布施工具的众生，都得开开心心的，烦恼消灭，皆种成佛种子，毕竟离苦得乐。南无阿弥佗佛。

Enjoy!

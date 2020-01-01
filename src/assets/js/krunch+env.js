/**
 * Krunch Environment
 *
 * This is where you can use the Krunch Utilities
 * and mount your view components.
 */

(async function main() {
  await krunch.compile() // init compiler


  // add 3rd-party critical assets
  // into service worker
  // (!!) all local assets added by default
  const assets = [
    'https://platform.twitter.com/widgets.js',
    'https://kit.fontawesome.com/04e017c909.js',
    'https://loouislow81.github.io/old/assets/pdf/loouislow_resume_13_april_2019.pdf'
  ]
  krunch.addCache(assets)


  // mount components
  const components = 'global-main-menu, global-small-footer, block-home, block-about, block-skills, block-experience, block-pet-project, blog-posts-latest, block-blog, block-contact, card-github-projects, card-project-promos, card-skills, card-experiences, card-blog-posts, text-heading, text-paragraph, social-twitter, social-icon-link, button-large, button-ultra, icon-platform, image-avatar'
  krunch.mount(components)


}())
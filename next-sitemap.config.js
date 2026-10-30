/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://nesscotech.com',
  generateRobotsTxt: false,
  generateIndexSitemap: true,
  exclude: ['/api/*', '/get-help/step-*'],
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString(),
  }),
};

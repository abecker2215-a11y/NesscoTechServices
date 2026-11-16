/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://nesscotech.com',
  generateRobotsTxt: false,
  generateIndexSitemap: true,
  exclude: ['/api/*', '/get-help/*', '/apple-icon', '/icon.svg', '/opengraph-image'],
  changefreq: 'weekly',
  priority: 0.7,
  // Pages that exist in the app but are not reachable by the crawler used at
  // build time (e.g. newer pages not yet live on the deployed site).
  additionalPaths: async () => [
    { loc: '/security-checklist', changefreq: 'weekly', priority: 0.6 },
    { loc: '/partner-referral', changefreq: 'weekly', priority: 0.6 },
  ],
  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: config.priority,
  }),
};

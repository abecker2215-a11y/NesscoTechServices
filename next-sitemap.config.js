/** @type {import('next-sitemap').IConfig} */
// Location pages use force-dynamic at render time but their slugs are
// statically known from src/lib/locations.ts. Read the file directly (no TS
// module loading in this plain-JS config) and list all location URLs so they
// appear in the sitemap without changing page rendering behavior.
const fs = require("fs");
const path = require("path");
const locationsSrc = fs.readFileSync(path.join(__dirname, "src/lib/locations.ts"), "utf8");
const slugs = locationsSrc.match(/slug: "([^"]+)"/g).map((m) => m.match(/slug: "([^"]+)"/)[1]);

module.exports = {
  siteUrl: 'https://nesscotech.com',
  generateRobotsTxt: false,
  generateIndexSitemap: true,
  exclude: ['/api/*', '/get-help/*', '/apple-icon', '/icon.svg', '/opengraph-image'],
  changefreq: 'weekly',
  priority: 0.7,
  additionalPaths: async () => [
    { loc: '/security-checklist', changefreq: 'weekly', priority: 0.6 },
    { loc: '/partner-referral', changefreq: 'weekly', priority: 0.6 },
    ...slugs.map((slug) => ({
      loc: `/${slug}`,
      changefreq: 'weekly',
      priority: 0.7,
    })),
  ],
  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: config.priority,
  }),
};

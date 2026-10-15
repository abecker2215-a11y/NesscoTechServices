/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://nesscotech.com",
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ["/server-sitemap.xml", "/get-help/step-*", "/icon.svg", "/opengraph-image"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/api/", "/get-help/step-*"] },
    ],
  },
  transform: async (config, path) => {
    const priorityMap = {
      "/": 1.0,
      "/services": 0.9,
      "/pricing": 0.8,
      "/about": 0.7,
      "/contact": 0.7,
      "/get-help": 0.9,
      "/guides": 0.8,
      "/glossary": 0.6,
      "/privacy": 0.2,
      "/terms": 0.2,
    };
    const changeFreqMap = {
      "/": "weekly",
      "/services": "weekly",
      "/pricing": "monthly",
      "/about": "monthly",
      "/contact": "monthly",
      "/get-help": "daily",
      "/guides": "weekly",
    };
    const isLocation = /^\/it-support-/.test(path);
    const isGuide = /^\/guides(\/|$)/.test(path);
    const isServiceDetail = /^\/services\//.test(path);
    return {
      loc: path,
      changefreq: changeFreqMap[path] || (isGuide ? "weekly" : "monthly"),
      priority: isLocation || isGuide || isServiceDetail ? 0.8 : priorityMap[path] || 0.5,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
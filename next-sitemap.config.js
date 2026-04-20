/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pretimmopro.fr',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pretimmopro.fr'}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Priorité par type de page
    let priority = 0.7
    let changefreq = 'monthly'

    if (path === '/') {
      priority = 1.0
      changefreq = 'weekly'
    } else if (
      path.includes('/simulateur-pret') ||
      path.includes('/capacite-emprunt') ||
      path.includes('/frais-notaire') ||
      path.includes('/remboursement-anticipe') ||
      path.includes('/taux-fixe-vs-variable')
    ) {
      priority = 1.0
      changefreq = 'monthly'
    } else if (path.includes('/taux-immobilier/')) {
      priority = 0.7
      changefreq = 'weekly'
    } else if (path === '/guides') {
      priority = 0.9
      changefreq = 'weekly'
    } else if (path.includes('/articles/') || path === '/taux-endettement' || path === '/documents-dossier-pret' || path === '/ptz-2026') {
      priority = 0.8
      changefreq = 'monthly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
  exclude: ['/mentions-legales', '/cgu', '/politique-confidentialite'],
}

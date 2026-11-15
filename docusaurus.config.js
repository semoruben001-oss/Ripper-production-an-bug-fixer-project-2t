// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Ripper Bug Fixer',
  tagline: 'AI that finds, fixes, and validates bugs, then opens the PR',
  url: 'https://ripper-production-an-bug-fixer-project-2t.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Ripper Bug Fixer',
        items: [
          {to: '/docs/intro', label: 'Docs', position: 'left'},
          {
            href: 'https://github.com/semoruben001-oss/Ripper-production-an-bug-fixer-project-2t',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: 'Ripper Bug Fixer — contact ripperrip667@gmail.com',
      },
    }),
};

module.exports = config;

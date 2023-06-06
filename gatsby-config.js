/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
    siteMetadata: {
        title: `Joon 개발노트`,
        author: {
            name: `Junho You`,
            summary: `who lives and works in Seoul building useful things.`,
        },
        description: `Joon 개발노트`,
        siteUrl: `https://jooonho.dev/`,
    },
    plugins: [
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: "G-6XBKRHHK6W",
                head: true,
            },
        },
        `gatsby-plugin-image`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content`,
                name: `blog`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 630,
                        },
                    },
                    {
                        resolve: `gatsby-remark-responsive-iframe`,
                        options: {
                            wrapperStyle: `margin-bottom: 1.0725rem`,
                        },
                    },
                    {
                        resolve: 'gatsby-remark-video',
                        options: {
                            width: 800,
                            height: 'auto',
                            preload: 'auto',
                            muted: true,
                            autoplay: true,
                            playsinline: true,
                            controls: true,
                            loop: true,
                        },
                    },
                    `gatsby-remark-prismjs`,
                ],
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
            {
                serialize: ({ query: { site, allMarkdownRemark } }) => {
                    return allMarkdownRemark.nodes.map((node) => {
                        return Object.assign({}, node.frontmatter, {
                            description: node.excerpt,
                            date: node.frontmatter.date,
                            url:
                                site.siteMetadata.siteUrl +
                                node.fields.slug,
                            guid:
                                site.siteMetadata.siteUrl +
                                node.fields.slug,
                            custom_elements: [
                                { 'content:encoded': node.html },
                            ],
                        })
                    })
                },
        query: `{
              allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
                nodes {
                  excerpt
                  html
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                    date
                  }
                }
              }
            }`,
                        output: '/rss.xml',
                        title: 'Joon Blog RSS Feed',
                    },
                ],
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Joon 개발노트`,
                short_name: `Joon 개발노트`,
                start_url: `/`,
                background_color: `#0d1117`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/icon.png`, // This path is relative to the root of the site.
            },
        },
        `gatsby-plugin-sitemap`,
        'gatsby-plugin-robots-txt'
    ],
}

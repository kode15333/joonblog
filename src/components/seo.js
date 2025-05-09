import * as React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

const Seo = ({ description, title, children }) => {
    const { site } = useStaticQuery(
        graphql`
            query {
                site {
                    siteMetadata {
                        title
                        description
                        social {
                            twitter
                        }
                    }
                }
            }
        `,
    )

    const metaDescription = description || site.siteMetadata.description
    const defaultTitle = site.siteMetadata?.title

    return (
        <>
            <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
            <meta name="description" content={metaDescription} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary" />
            <meta
                name="twitter:creator"
                content={site.siteMetadata?.social?.twitter || ``}
            />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={metaDescription} />
            <script async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8161968102453153"
                    crossOrigin="anonymous"></script>
            {children}
        </>
    )
}

export default Seo

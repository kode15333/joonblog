import * as React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

const Bio = () => {
    const data = useStaticQuery(graphql`
        query BioQuery {
            site {
                siteMetadata {
                    author {
                        name
                        summary
                    }
                    social {
                        twitter
                        github
                        linkedin
                    }
                }
            }
        }
    `)

    const author = data.site.siteMetadata?.author

    return (
        <div className="bio">
            {author?.name && (
                <p>
                    Written by <strong>{author.name}</strong>{' '}
                    {author?.summary || null}
                </p>
            )}
        </div>
    )
}

export default Bio

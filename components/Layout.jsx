import React from 'react'


import { rhythm, scale } from '../utils/typography'
import Link from 'next/link'

const Layout = ({ pathname, title, children }) => {

    return (
        <div
            style={{
                marginLeft: `auto`,
                marginRight: `auto`,
                maxWidth: rhythm(24),
                padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
            }}
        >
            <h1
                style={{
                    ...scale(1.5),
                    marginBottom: rhythm(1.5),
                    marginTop: 0,
                }}
            >
                <Link
                    style={{
                        boxShadow: `none`,
                        color: `inherit`,
                    }}
                    href={`/`}
                >
                    {title}
                </Link>
            </h1>
            <main>{children}</main>
        </div>
    )
}


export default Layout

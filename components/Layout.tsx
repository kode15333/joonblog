import React, { ReactNode } from 'react'


import { rhythm, scale } from '../utils/typography'
import Link from 'next/link'

type Props = {
    pathname: string
    title: string
    children: ReactNode
}
const Layout = ({ pathname, title, children }: Props) => {
    let header

    if (pathname === '/') {
        header = (
            <h1
                style={{
                    ...scale(1.5),
                    marginBottom: rhythm(1.5),
                    marginTop: 0,
                }}
            >
                <Link

                    href={`/`}
                >
                    <a style={{
                        boxShadow: `none`,
                        color: `inherit`,
                    }}>
                        {title}
                    </a>
                </Link>
            </h1>
        )
    } else {
        header = (
            <h3
                style={{
                    fontFamily: `Montserrat, sans-serif`,
                    marginTop: 0,
                }}
            >
                <Link
                    href={`/`}
                >
                    <a style={{
                        boxShadow: `none`,
                        color: `inherit`,
                    }}>
                        {title}

                    </a>
                </Link>
            </h3>
        )
    }
    return (
        <div
            style={{
                marginLeft: `auto`,
                marginRight: `auto`,
                maxWidth: rhythm(24),
                padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
            }}
        >
            <header>{header}</header>
            <main>{children}</main>
        </div>
    )
}


export default Layout

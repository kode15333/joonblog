import * as React from 'react'
import { Link } from 'gatsby'

const Layout = ({ location, title, children }) => {
    const rootPath = `${__PATH_PREFIX__}/`
    const isRootPath = location.pathname === rootPath
    let header

    if (isRootPath) {
        header = (
            <h1 className="main-heading">
                <Link to="/">{title}</Link>
            </h1>
        )
    } else {
        header = (
            <Link className="header-link-home" to="/">
                {title}
            </Link>
        )
    }

    return (
        <div className="global-wrapper" data-is-root-path={isRootPath}>
            <header className="global-header">{header}
                <meta name="google-adsense-account" content="ca-pub-8161968102453153" />
            </header>
            <main>{children}</main>
            <footer>© {new Date().getFullYear()}, Customized by Joon</footer>
        </div>
    )
}

export default Layout

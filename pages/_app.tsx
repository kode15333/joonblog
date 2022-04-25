import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '../styles/github-markdown-light.css'

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}

export default MyApp

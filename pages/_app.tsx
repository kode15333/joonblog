import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as gtag from '../lib/ga'

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter()
    useEffect(() => {
        const handleRouteChange = (url: string) => {
            if (process.env.NODE_ENV === 'production') {
                gtag.pageview(url)
            }
        }
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events])

    return <Component {...pageProps} />
}

export default MyApp

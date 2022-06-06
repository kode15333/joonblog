import { Head, Html, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from '../lib/ga'

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
                <script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${GA_TRACKING_ID}', {
                                     page_path: window.location.pathname,
                                    });
                            `,
                    }}
                />
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    )
}

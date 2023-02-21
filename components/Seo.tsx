import React from 'react'
import Head from 'next/head'

type Props = {
    title: string
    description: string
}
const Seo = ({ title, description }: Props) => {
    return (
        <Head>
            <title>{title}</title>
            <meta
                content="width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1"
                name="viewport"
            />
            <meta name="description" content={description} />
            <meta name="op:title" content={title} />
            <meta name="op:description" content={description} />
            <meta name="op:type" content="website" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta
                name="naver-site-verification"
                content="22974dbcbfc26d5faefe4284affa5c72b6f31c97"
            />
        </Head>
    )
}

export default Seo

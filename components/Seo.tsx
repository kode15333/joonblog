import React from 'react'
import Head from 'next/head'

type Props = {
    title: string,
    description: string
}
const Seo = ({ title, description }: Props) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name='description' content={description}></meta>
            <meta name='op:title' content={title}></meta>
            <meta name='op:description' content={description}></meta>
        </Head>
    )
}

export default Seo

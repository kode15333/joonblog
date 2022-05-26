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
            <meta name='description' content={description}/>
            <meta name='op:title' content={title}/>
            <meta name='op:description' content={description}/>
            <meta name='op:type' content='website'/>
            <meta name='twitter:card' content='summary'/>
            <meta name='twitter:title' content={title}/>
            <meta name='twitter:description' content={description}/>
        </Head>
    )
}

export default Seo

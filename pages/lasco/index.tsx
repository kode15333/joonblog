import React from 'react';
import Head from 'next/head'

export const getServerSideProps = async () => {


    return {
        props: {
            data: 'data'
        }
    }
}

type Props = {
    data: string
}

const Lasco = ({data}:Props) => {


    return (
        <div>
            <Head>
                <title>Lasco</title>
                <link rel="icon" type="image/x-icon" href="https://creator-stage.supervirtuals.io/enc/28jrsDr%2BqrJMagCF%2FdHU1w%3D%3D?s=10x10&f=webp&q=40"/>
                <meta  property="og:title"  content="Lasco"/>
                <meta property="og:description"  content="think better" />
                <meta property="og:image"  content="https://creator-stage.supervirtuals.io/enc/28jrsDr%2BqrJMagCF%2FdHU1w%3D%3D?s=500x500&f=webp&q=40" />
            </Head>
            <h1>{data}</h1>
            <h1>Lasco</h1>
        </div>
    );
};

export default Lasco;
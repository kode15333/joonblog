import React from 'react';
import Head from 'next/head'

export const getServerSideProps = async () => {


    return {
        props: {
            data: '2CGzCxGdSVkt6t2DCkxDIVM%2FzZKIrVsEYXNHo1hizN4zeZU4rawlJalXpDryMc%2FB3FVoyIFNCAOfkSXFgoNYcw%3D%3D'
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
                <link rel="icon" type="image/x-icon" href={`https://creator-stage.supervirtuals.io/enc/${data}?s=10x10&f=webp&q=40`}/>
                <meta property="og:type"  content="website" />
                <meta property="og:image"  content={`https://creator-stage.supervirtuals.io/enc/${data}?s=500x500&f=webp&q=40`} />
                <meta  property="og:title"  content="Lasco"/>
                <meta property="og:description"    content="The magic word, /gen AI image generation and beyond" />
                <meta property="og:url"  content="https://lasco.ai" />
                <meta property="twitter:card"  content="summary_large_image" />
                <meta property="twitter:title"  content="Lasco" />
                <meta property="twitter:description"  content="The magic word, /gen AI image generation and beyond" />
                <meta property="twitter:image"  content={`https://creator-stage.supervirtuals.io/enc/${data}?s=500x500&f=webp&q=40`} />


            </Head>
            <img src={`https://creator-stage.supervirtuals.io/enc/${data}?s=500x500&f=webp&q=40`} alt="Lasco"/>
            <h1>{data}</h1>
            <h1>Lasco</h1>

        </div>
    );
};

export default Lasco;
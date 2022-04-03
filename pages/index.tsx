import type { NextPage } from 'next'
import styled from 'styled-components'

const Hello = styled.h1`
    color: red;
`
const Home: NextPage = () => {
    return <Hello>Hello Blog</Hello>
}

export default Home

import { getAllPosts } from '../lib/api'
import Link from 'next/link'
import { rhythm } from '../utils/typography'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import dayjs from 'dayjs'
import Seo from '../components/Seo'


export type PostType = {
    title: string
    description: string
    date: string
    slug: string
    content: string
}

type Props = {
    allPosts: PostType[]
}

export async function getStaticProps() {
    const allPosts = getAllPosts(['title', 'date', 'slug', 'description'])

    return {
        props: { allPosts },
    }
}

const Home = ({ allPosts }: Props) => {
    const { pathname } = useRouter()

    return (
        <Layout pathname={pathname} title='joons blog'>
            <Seo title="Junho's Blog" description='A Junho blog demonstrating what Junho can do.' />
            {allPosts.length &&
                allPosts.map(({ title, date, slug, description }) =>
                    (<article key={slug}>
                        <header>
                            <h3
                                style={{
                                    marginBottom: rhythm(1 / 4),
                                }}
                            >
                                <Link href={`/post/${slug}`}>
                                    {title}
                                </Link>
                            </h3>
                            <small>{dayjs(date).format('YYYY-MM-DD')}</small>
                        </header>
                        <section>
                            <p>{description}</p>
                        </section>
                    </article>))}
        </Layout>
    )
}

export default Home

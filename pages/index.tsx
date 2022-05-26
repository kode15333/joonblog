import { getAllPosts } from '../lib/api'
import Link from 'next/link'
import { rhythm } from '../utils/typography'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import dayjs from 'dayjs'
import Seo from '../components/Seo'
import { META } from '../constant'


export type PostType = {
    title: string
    description: string
    date: string
    slug: string
    content: string
    next: string
    previous: string
}

type Props = {
    allPosts: PostType[]
}

export async function getStaticProps() {
    const allPosts = getAllPosts()

    return {
        props: { allPosts },
    }
}

const Home = ({ allPosts }: Props) => {
    const { pathname } = useRouter()

    return (
        <Layout pathname={pathname} title={META.title}>
            <Seo title={META.title} description={META.description} />
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

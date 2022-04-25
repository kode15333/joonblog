import { getAllPosts } from '../lib/api'
import { format } from 'date-fns'
import Link from 'next/link'
import { rhythm } from '../utils/typography'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'


export type PostType = {
    title: string
    description: string
    draft?: string
    category: string
    tags: string[]
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
            {allPosts.length &&
                allPosts.map(({ title, date, slug}) => {
                    return (<article key={slug}>
                        <header>
                            <h3
                                style={{
                                    marginBottom: rhythm(1 / 4),
                                }}
                            >
                                <Link href={`/post/${decodeURIComponent(slug)}`}>
                                    <a>{title}</a>
                                </Link>
                            </h3>
                            <small>{format(new Date(date), 'yyyy-MM-dd')}</small>
                        </header>
                    </article>)
                })}
        </Layout>
    )
}

export default Home

import { getAllPosts } from '../lib/api'
import { format } from 'date-fns'
import Link from 'next/link'

export type PostType = {
    title: string
    description: string
    draft: boolean
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
    const allPosts = getAllPosts(['title', 'date', 'slug'])

    return {
        props: { allPosts },
    }
}

const Home = ({ allPosts }: Props) => {
    return (
        <div>
            {allPosts.length &&
                allPosts.map(({ title, date, slug }) => (
                    <h3 key={slug}>
                        {title}
                        <Link href={`/post/${decodeURIComponent(slug)}`}>
                            <a>{format(new Date(date), 'yyyy-MM-dd')}</a>
                        </Link>
                    </h3>
                ))}
        </div>
    )
}

export default Home

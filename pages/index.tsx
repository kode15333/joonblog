import { getAllPosts } from '../lib/api'
import Link from 'next/link'
import { rhythm } from '../utils/typography'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import dayjs from 'dayjs'
import Seo from '../components/Seo'
import { META } from '../constant'
import {
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
    List,
    ListRowProps,
    WindowScroller,
} from 'react-virtualized'
import { useRef } from 'react'

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
    const allPosts = getAllPosts()

    return {
        props: { allPosts },
    }
}

const cellCache = new CellMeasurerCache({
    fixedWidth: true,
})

const Home = ({ allPosts }: Props) => {
    const { pathname } = useRouter()
    const listRef = useRef<List>(null)

    const rowRenderer = ({ index, key, parent, style }: ListRowProps) => {
        const { title, date, slug, description } = allPosts[index]
        return (
            <CellMeasurer
                cache={cellCache}
                columnIndex={0}
                key={key}
                parent={parent}
                rowIndex={index}
            >
                {({ measure }) => (
                    <article style={style} onLoad={measure}>
                        <header>
                            <h3
                                style={{
                                    marginBottom: rhythm(1 / 4),
                                }}
                            >
                                <Link href={`/${slug}`}>{title}</Link>
                            </h3>
                            <small>{dayjs(date).format('YYYY-MM-DD')}</small>
                        </header>
                        <section>
                            <p>{description}</p>
                        </section>
                    </article>
                )}
            </CellMeasurer>
        )
    }
    return (
        <Layout pathname={pathname} title={META.title}>
            <Seo title={META.title} description={META.description} />
            <WindowScroller>
                {({ height, scrollTop, isScrolling, onChildScroll }) => (
                    <AutoSizer>
                        {({ width }) => (
                            <List
                                ref={listRef}
                                autoHeight
                                height={height}
                                width={width}
                                overscanRowCount={5}
                                isScrolling={isScrolling}
                                onScroll={onChildScroll}
                                scrollTop={scrollTop}
                                rowCount={allPosts.length}
                                rowHeight={cellCache.rowHeight}
                                rowRenderer={rowRenderer}
                                deferredMeasurementCache={cellCache}
                            />
                        )}
                    </AutoSizer>
                )}
            </WindowScroller>
        </Layout>
    )
}

export default Home

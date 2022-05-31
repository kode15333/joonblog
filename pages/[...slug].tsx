import React from 'react'
import { getAllPosts, getPagingFromSlug, getPostBySlug } from '../lib/api'
import markdownToHtml from '../lib/markdownToHtml'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { PostType } from './index'
import { rhythm, scale } from '../utils/typography'
import Seo from '../components/Seo'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import 'prismjs/themes/prism.css'
import { META } from '../constant'
import Link from 'next/link'


interface IParams extends ParsedUrlQuery {
    slug: string[]
}


export const getStaticPaths: GetStaticPaths = () => {
    const posts = getAllPosts()

    return {
        paths: posts.map((p) => ({
            params: {
                slug: p.slug.split('/'),
            },
        })),
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params as IParams

    const paging = getPagingFromSlug(slug.join('/'))
    const post = getPostBySlug(slug.join('/'))

    const content = await markdownToHtml(post.content || '')

    return {
        props: {
            post: {
                ...post,
                content,
            },
            paging,
        },
    }
}

interface PostParams {
    post: PostType
    paging: {
        next?: PostType
        previous?: PostType
    }
}


export default function Post({ post, paging }: PostParams) {
    const { pathname } = useRouter()

    const { title, date, description, content } = post
    const { next, previous } = paging
    return (
        <Layout pathname={pathname} title={META.title}>
            <Seo title={title} description={description} />
            <article>
                <header>
                    <h1
                        style={{
                            marginTop: rhythm(1),
                            marginBottom: 0,
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        style={{
                            ...scale(-1 / 5),
                            display: `block`,
                            marginBottom: rhythm(1),
                        }}
                    >
                        {dayjs(date).format('YYYY-MM-DD')}
                    </p>
                </header>
                <section
                    className='light markdown-body'
                    dangerouslySetInnerHTML={{ __html: content }} />
                <hr
                    style={{
                        marginBottom: rhythm(1),
                    }}
                />
                <nav style={{ fontSize: 'smaller' }}>
                    <ul
                        style={{
                            display: `flex`,
                            flexWrap: `wrap`,
                            justifyContent: `space-between`,
                            listStyle: `none`,
                            padding: 0,
                        }}
                    >
                        <li>
                            {previous  && (
                                <Link href={previous.slug}>
                                    <a>← {previous.title}</a>
                                </Link>
                            )}
                        </li>
                        <li>
                            {next &&
                                <Link href={next.slug}>
                                    <a>{next.title} →</a>
                                </Link>
                            }
                        </li>
                    </ul>
                </nav>
            </article>
        </Layout>

    )
}


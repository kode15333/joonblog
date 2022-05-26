import React from 'react'
import { getAllPosts, getPostBySlug } from '../../lib/api'
import markdownToHtml from '../../lib/markdownToHtml'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { PostType } from '../index'
import { rhythm, scale } from '../../utils/typography'
import Seo from '../../components/Seo'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import 'prismjs/themes/prism.css'
import { META } from '../../constant'


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

    const post = getPostBySlug({slug: slug.join('/')})

    const content = await markdownToHtml(post.content || '')

    return {
        props: {
            post: {
                ...post,
                content,
            },
        },
    }
}


export default function Post({ post}: { post: PostType }) {
    const { pathname } = useRouter()

    const { title, date, description, content, next, previous } = post
    console.log(next, previous)
    return (
        <Layout pathname={pathname} title={META.title}>
            <Seo title={title} description={description}/>
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
                    className="light markdown-body"
                    dangerouslySetInnerHTML={{ __html: content }} />
                <hr
                    style={{
                        marginBottom: rhythm(1),
                    }}
                />
            </article>
        </Layout>

    )
}


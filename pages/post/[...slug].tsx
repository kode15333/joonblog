import React from 'react'
import { getAllPosts, getPostBySlug } from '../../lib/api'
import markdownToHtml from '../../lib/markdownToHtml'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { PostType } from '../index'
import { rhythm } from '../../utils/typography'
import Link from 'next/link'


interface IParams extends ParsedUrlQuery {
    slug: string[]
}

export const getStaticPaths: GetStaticPaths = () => {
    const posts = getAllPosts(['slug']) as PostType[]

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
    const post = getPostBySlug(slug.join('/'), [
        'title',
        'description',
        'draft',
        'slug',
        'category',
        'tags',
        'content',
    ]) as PostType

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


export default function Post({ post }: { post: PostType }) {
    const { slug, title, date, description, content } = post
    return (

        <div
            style={{
                marginLeft: `auto`,
                marginRight: `auto`,
                maxWidth: rhythm(24),
                padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
            }}
        >
            <h3
                style={{
                    fontFamily: `Montserrat, sans-serif`,
                    marginTop: 0,
                }}
            >
                <Link
                    href={`/`}
                >
                    {title}
                </Link>
            </h3>
            <section>
                <p
                    className="markdown-body"
                    dangerouslySetInnerHTML={{
                        __html: content,
                    }}
                />
            </section>
        </div>
    )
}


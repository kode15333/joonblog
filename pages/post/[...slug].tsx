import React from 'react'
import { useRouter } from 'next/router'
import { getAllPosts, getPostBySlug2 } from '../../lib/api'
import markdownToHtml from '../../lib/markdownToHtml'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { PostType } from '../index'

interface IParams extends ParsedUrlQuery {
    slug: string[]
}

export const getStaticPaths: GetStaticPaths = () => {
    const posts = getAllPosts(['slug']) as PostType[]

    return {
        paths: posts.map((p) => ({
            params: {
                slug: p.slug.split('/')
            },
        })),
        fallback: false,
    }
}
export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params as IParams
    const post = getPostBySlug2(slug.join('/'), [
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
    const router = useRouter()
    return (
        <div>
            <h1>{post.title}</h1>
        </div>
    )
}


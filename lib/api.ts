import fs from 'fs'
import glob from 'glob'
import matter from 'gray-matter'
import { findIndex, flow, replace } from 'lodash/fp'

const POSTS_DIRECTORY = '_posts'

function getPostSlugs() {
    return glob.sync(`${POSTS_DIRECTORY}/**/*.md`)
}


const getRealSlug = (slug: string) => flow(
    replace(`${POSTS_DIRECTORY}/`, ''),
    replace(/\.md$/, ''),
)(slug)

export function getPostBySlug(slug: string) {
    const realSlug = getRealSlug(slug)

    const fileContents = fs.readFileSync(`${POSTS_DIRECTORY}/${realSlug}.md`, 'utf8')
    const { data, content } = matter(fileContents)
    const { date, description, title } = JSON.parse(JSON.stringify(data))
    return { content, date, description, slug: realSlug, title }
}

export function getAllPosts() {
    const slugs = getPostSlugs()
    return slugs
        .map((slug) => getPostBySlug(slug) )
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}

export function getPagingFromSlug(slug: string) {
    const slugs = getAllPosts()
    const index = findIndex({slug})(slugs)
    return {
        previous : index === slugs.length - 1 ? null : slugs[index + 1],
        next : index === 0 ? null : slugs[index - 1]
    }
}

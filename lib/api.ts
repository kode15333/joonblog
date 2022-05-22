import fs from 'fs'
import glob from 'glob'
import matter from 'gray-matter'
import { flow, replace } from 'lodash/fp'

const POSTS_DIRECTORY = '_posts'

function getPostSlugs() {
    return glob.sync(`${POSTS_DIRECTORY}/**/*.md`)
}

export function getPostBySlug(slug: string, fields :  string[]) {
    const realSlug = flow(
        replace(`${POSTS_DIRECTORY}/`, ''),
        replace(/\.md$/, '')
    )(slug)

    const fileContents = fs.readFileSync(`${POSTS_DIRECTORY}/${realSlug}.md`, 'utf8')
    const { data, content } = matter(fileContents)
    const {date, description, title} = JSON.parse(JSON.stringify(data))

    return {content, date, description, slug : realSlug, title}
}

export function getAllPosts(fields : string[]) {
    const slugs = getPostSlugs()
    return slugs
        .map((slug) => getPostBySlug(slug, fields))
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}

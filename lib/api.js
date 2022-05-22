import fs from 'fs'
import glob from 'glob'
import matter from 'gray-matter'
import { flow, replace } from 'lodash/fp'

const POSTS_DIRECTORY = '_posts'

function getPostSlugs() {
    return glob.sync(`${POSTS_DIRECTORY}/**/*.md`)
}

export function getPostBySlug(slug, fields = []) {
    const realSlug = flow(
        replace(`${POSTS_DIRECTORY}/`, ''),
        replace(/\.md$/, '')
    )(slug)

    const fileContents = fs.readFileSync(`${POSTS_DIRECTORY}/${realSlug}.md`, 'utf8')
    const { data, content } = matter(fileContents)
    const metaData = JSON.parse(JSON.stringify(data))
    const items = {}

    fields.forEach((field) => {
        if (field === 'slug') {
            items[field] = realSlug
        }
        if (field === 'content') {
            items[field] = content
        }
        if (field === 'date' && data[field]) {
            items[field] = metaData[field]
        }

        if (typeof data[field] !== 'undefined') {
            items[field] = metaData[field]
        }
    })

    return items
}

export function getAllPosts(fields = []) {
    const slugs = getPostSlugs()
    return slugs
        .map((slug) => getPostBySlug(slug, fields))
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}

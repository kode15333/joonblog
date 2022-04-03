import fs from 'fs'
import glob from 'glob'
import matter from 'gray-matter'
import { flow, replace, toString } from 'lodash/fp'

const POSTS_DIRECTORY = '_posts'

function getPostSlugs() {
    return glob.sync(`${POSTS_DIRECTORY}/**/*.md`)
}

export function getPostBySlug(slug, fields = []) {
    const realSlug = flow(
        replace(`${POSTS_DIRECTORY}/`, ''),
        replace(/\.md$/, '')
    )(slug)
    const fileContents = fs.readFileSync(slug, 'utf8')
    const { data, content } = matter(fileContents)

    const items = {}

    fields.forEach((field) => {
        if (field === 'slug') {
            items[field] = realSlug
        }
        if (field === 'content') {
            items[field] = content
        }
        console.log({ field }, toString(data[field]))
        if (field === 'date' && data[field]) {
            items[field] = toString(data[field])
        }

        if (typeof data[field] !== 'undefined') {
            items[field] = data[field]
        }
    })
    console.log(items)

    return items
}

export function getAllPosts(fields = []) {
    const slugs = getPostSlugs()
    return slugs
        .map((slug) => getPostBySlug(slug, fields))
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}

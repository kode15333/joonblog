import fs from 'fs'
import glob from 'glob'
import matter from 'gray-matter'
import { flow, replace } from 'lodash/fp'

const POSTS_DIRECTORY = '_posts'

function getPostSlugs() {
    return glob.sync(`${POSTS_DIRECTORY}/**/*.md`)
}
type Param = {
    slug : string
    previous?: string
    next?: string
}

const getRealSlug = (slug : string) => flow(
    replace(`${POSTS_DIRECTORY}/`, ''),
    replace(/\.md$/, '')
)(slug)

export function getPostBySlug({slug, next = '', previous = ''}: Param) {
    const realSlug = getRealSlug(slug)

    const fileContents = fs.readFileSync(`${POSTS_DIRECTORY}/${realSlug}.md`, 'utf8')
    const { data, content } = matter(fileContents)
    const {date, description, title} = JSON.parse(JSON.stringify(data))
    return {content, date, description, slug : realSlug, title, next : getRealSlug(next), previous: getRealSlug(previous)}
}

export function getAllPosts() {
    const slugs = getPostSlugs()
    return slugs
        .map((slug, index) => {
            const previous = index === slugs.length - 1 ? '' : slugs[index + 1]
            const next = index === 0 ? '' : slugs[index - 1]

            return getPostBySlug({slug, previous, next})
        })
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}

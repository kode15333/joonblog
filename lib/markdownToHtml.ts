import { remark } from 'remark'
import prism from 'remark-prism'
import remarkGfm from 'remark-gfm'
import html from 'remark-html'

export default async function markdownToHtml(markdown: any) {
    const result = await remark()
        .use(prism)
        .use(remarkGfm)
        .use(html, { sanitize: false })
        .process(markdown)
    return result.toString()
}

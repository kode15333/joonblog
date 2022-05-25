import { remark } from 'remark'
import prism from 'remark-prism'
import remarkGfm from 'remark-gfm'
import html from 'remark-html'
import { VFileCompatible } from 'vfile'


export default async function markdownToHtml(markdown: VFileCompatible) {
    const result =  await remark()
        .use(prism)
        .use(remarkGfm)
        .use(html, { sanitize: false })
        .process(markdown);
    return result.toString()
}

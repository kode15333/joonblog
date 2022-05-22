import { remark } from 'remark'
import html from 'remark-html'
import prism from 'remark-prism'
import { VFileCompatible } from 'vfile'


export default async function markdownToHtml(markdown: VFileCompatible) {
    const result =  await remark()
        .use(prism)
        .use(html, { sanitize: false })
        .process(markdown);
    return result.toString()
}

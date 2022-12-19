import { remark } from 'remark'
import prism from 'remark-prism'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkLint from 'remark-lint'
import remarkLintBlockquoteIndentation from 'remark-lint-blockquote-indentation'
import remarkLintBlockquote from 'remark-github-beta-blockquote-admonitions'

export default async function markdownToHtml(markdown: string) {
    const result = await remark()
        .use(prism)
        .use(remarkParse)
        .use(remarkLint)
        .use(remarkLintBlockquoteIndentation)
        .use(remarkLintBlockquote)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(markdown)

    return result.toString()
}

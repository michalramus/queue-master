import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function MarkdownToHtml({
    markdown,
    className,
}: {
    markdown: string;
    className?: React.ComponentProps<"div">["className"];
}) {
    return (
        <article className={`prose lg:prose-xl ${className}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeRaw]]}>
                {markdown}
            </ReactMarkdown>
        </article>
    );
}

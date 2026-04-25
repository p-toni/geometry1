import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function transformUrl(url: string) {
  if (
    url.startsWith('/content/') ||
    url.startsWith('/images/') ||
    url.startsWith('https://') ||
    url.startsWith('http://') ||
    url.startsWith('mailto:')
  ) {
    return url;
  }
  return '';
}

export default function MarkdownRuntime({
  markdown,
  onOpenContent,
}: {
  markdown: string;
  onOpenContent?: (href: string) => void;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      urlTransform={transformUrl}
      components={{
        a({ href, children }) {
          if (href?.startsWith('/content/')) {
            return (
              <button
                type="button"
                data-no-drag="true"
                className="markdown-content-link"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenContent?.(href);
                }}
              >
                {children}
              </button>
            );
          }
          return (
            <a
              href={href}
              data-no-drag="true"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noreferrer' : undefined}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

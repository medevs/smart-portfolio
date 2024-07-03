import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { Components } from 'react-markdown';

interface MarkdownContentProps {
  content: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  const components: Components = {
    code({ node, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = node && node.type === 'element' && node.tagName === 'code' && node.properties?.className === undefined;
      
      return !isInline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h1: ({ node, ...props }) => <h1 className="text-4xl font-bold my-4" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold my-3" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold my-2" {...props} />,
    p: ({ node, ...props }) => <p className="my-2 leading-relaxed" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc list-inside my-2" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-2" {...props} />,
    li: ({ node, ...props }) => <li className="my-1" {...props} />,
    a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />
    ),
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
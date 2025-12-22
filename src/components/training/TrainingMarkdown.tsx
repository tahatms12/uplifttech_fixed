import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import SafeLink from './SafeLink';

interface TrainingMarkdownProps {
  content: string;
}

const TrainingMarkdown: React.FC<TrainingMarkdownProps> = ({ content }) => {
  if (!content) {
    return <p className="text-gray-400">Not specified.</p>;
  }

  return (
    <div className="prose prose-invert max-w-none text-gray-100">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ href, children, ...props }) => (
            <SafeLink href={href} {...props}>
              {children}
            </SafeLink>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default TrainingMarkdown;

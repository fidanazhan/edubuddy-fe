import ReactMarkdown from 'react-markdown';

import remarkMath from 'remark-math'; // For math formulas
import remarkGfm from 'remark-gfm'; // For tables and GitHub Flavored Markdown

import rehypeKatex from 'rehype-katex'; // For rendering math with KaTeX
import 'katex/dist/katex.min.css'; // KaTeX CSS

import rehypeHighlight from 'rehype-highlight'; // For syntax highlighting
import 'highlight.js/styles/github-dark.css'; // Syntax highlighting theme
import 'prismjs/themes/prism.css'; // Syntax highlighting theme
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import rehypeAddClasses from 'rehype-add-classes'; // For adding classes to elements
import './chatResponse.css';

const ChatResponse = ({ answer }) => {
  const components = {
    code: ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-3 rounded-lg mt-2 dark:bg-zinc-800`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="py-1" {...props}>
        {children}
      </li>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-outside ml-4" {...props}>
        {children}
      </ul>
    ),
    strong: ({ children, ...props }) => (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    ),
    a: ({ children, ...props }) => (
      <a
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    ),
  };
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[
          rehypeKatex,
          rehypeHighlight,
          [rehypeAddClasses, {
            table: 'markdown-table',
          }],
        ]}
        components={components}
      >
        {answer}
      </ReactMarkdown>
    </div>
  );
};

export default ChatResponse;
import React from "react";
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

const ChatResponse2 = ({ answer }) => {
  const components = {
    code: ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");

      // Convert children array (React elements) into a plain string
      const codeString = React.Children.map(children, child =>
        typeof child === "string" ? child : child.props.children
      ).join("").trim();

      return !inline && match ? (
        <div className="relative bg-[#282a36] rounded-lg overflow-hidden">
          {/* Top Bar */}
          <div className="flex justify-between items-center bg-[#343746] px-4 py-2 text-lg lg:text-base text-gray-300">
            <span>{match[1]}</span>
            <div className="flex gap-2">
              <button
                className="hover:text-white transition text-lg lg:text-base"
                onClick={() => navigator.clipboard.writeText(codeString)}
              >
                Copy
              </button>
            </div>
          </div>

          {/* Code Block */}
          <SyntaxHighlighter
            style={dracula}
            language={match[1]}
            PreTag="div"
            className="px-4 py-3 codeFont overflow-x-auto text-lg lg:text-base"
            {...props}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="codeFont bg-zinc-300 text-black dark:bg-zinc-700 dark:text-gray-300/80 py-0.5 px-1 rounded-md text-lg lg:text-base" {...props}>
          {codeString}
        </code>
      );
    },
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-outside ml-4 text-lg lg:text-base" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="ml-8 mt-2 text-lg lg:text-base" {...props}>
        {children}
      </li>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-outside ml-4 text-lg lg:text-base" {...props}>
        {children}
      </ul>
    ),
    strong: ({ children, ...props }) => (
      <span className="font-semibold text-lg lg:text-base" {...props}>
        {children}
      </span>
    ),
    a: ({ children, ...props }) => (
      <a
        className="text-blue-500 hover:underline text-lg lg:text-base"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl lg:text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl lg:text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl lg:text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="text-lg lg:text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5 className="text-base lg:text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6 className="text-sm lg:text-xs font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    ),
    p: ({ children, ...props }) => (
      <p className="mt-4 text-lg lg:text-base" {...props}>
        {children}
      </p>
    ),
  };
  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[
          rehypeKatex,
          rehypeHighlight,
          [rehypeAddClasses, {
            table: 'markdown-table',
            pre: "custom-pre"
          }],
        ]}
        components={components}
        className="chatResponse sm:text-sm md:text-md lg:text-lg text-lg"
      >
        {answer}
      </ReactMarkdown>
    </>
  );
};

export default ChatResponse2;
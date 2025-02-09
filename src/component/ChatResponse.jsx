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
      >
        {answer}
      </ReactMarkdown>
    </div>
  );
};

export default ChatResponse;
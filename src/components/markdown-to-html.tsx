import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

export default function MarkdownToHtml({markdown}:{markdown:string}) {
  return (
      <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
              pre: ({ children, ...props }) => (
                  <div className="flex flex-col w-full ">
                      <div className="flex mr-1 md:mr-0 justify-between items-center bg-gray-800 px-2 py-1 rounded-t-md ">
                          <div className="flex items-center gap-2 ">
                              <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="text-xs border border-gray-500 rounded-md px-2 py-1 cursor-pointer text-white"
                                  onClick={() => {
                                      // Get the actual text content from the pre element
                                      const preElement = children?.props?.children;
                                      const textToCopy = typeof preElement === 'string' ? preElement : '';
                                      navigator.clipboard.writeText(textToCopy);
                                      toast.success('Kopyalandı');
                                  }}
                              >Kopyala</span>
                          </div>
                      </div>
                      <pre className="bg-gray-800 border-t-none  text-white p-3 rounded-b-md w-[300px] md:w-full overflow-x-auto block text-sm md:text-base scrollbar-t hin scrollbar-thumb-gray-800 scrollbar-track-gray-700 " {...props} >

                          {children}
                      </pre>
                  </div>
              ),
              h1: ({ children, ...props }) => (
                  <h1 className="text-xl md:text-2xl font-bold py-2" {...props}>
                      {children}
                  </h1>
              ),
              h2: ({ children, ...props }) => (
                  <h2 className="text-lg md:text-xl font-bold py-2" {...props}>
                      {children}
                  </h2>
              ),
              h3: ({ children, ...props }) => (
                  <h3 className="text-base md:text-lg font-bold py-2" {...props}>
                      {children}
                  </h3>
              ),
              h4: ({ children, ...props }) => (
                  <h4 className="text-sm md:text-base font-bold" {...props}>
                      {children}
                  </h4>
              ),
              h5: ({ children, ...props }) => (
                  <h5 className="text-xs md:text-sm font-bold" {...props}>
                      {children}
                  </h5>
              ),
              h6: ({ children, ...props }) => (
                  <h6 className="text-xs font-bold" {...props}>
                      {children}
                  </h6>
              ),
              p: ({ children, ...props }) => (
                  <p className="text-sm md:text-base" {...props}>
                      {children}
                  </p>
              ),
              strong: ({ children, ...props }) => (
                  <strong className="font-bold" {...props}>
                      {children}
                  </strong>
              ),
              em: ({ children, ...props }) => (
                  <em className="italic" {...props}>
                      {children}
                  </em>
              ),
              a: ({ children, ...props }) => (
                  <a className="text-blue-500" {...props}>
                      {children}
                  </a>
              ),
              code: ({ inline, ...props }) => (
                  inline
                      ? <code className="bg-gray-200 dark:bg-gray-300 px-1 py-1 rounded text-xs md:text-sm" {...props} />
                      : <code className="block w-full bg-gray-800 text-white dark:bg-gray-800 p-3 rounded-md text-xs md:text-sm overflow-x-auto  whitespace-pre" {...props} />
              ),
              table: ({ children, ...props }) => (
                  <div className="w-full my-1">
                      <table className="table-auto w-[300px] md:w-full overflow-x-auto block" {...props}>
                          {children}
                      </table>
                  </div>
              ),
              tr: ({ children, ...props }) => (
                  <tr className="border-b border-gray-200" {...props}>
                      {children}
                  </tr>
              ),
              td: ({ children, ...props }) => (
                  <td className="border border-gray-200 p-2 whitespace-nowrap" {...props}>
                      {children}
                  </td>
              ),
              th: ({ children, ...props }) => (
                  <th className="border border-gray-200 p-2 whitespace-nowrap" {...props}>
                      {children}
                  </th>
              ),
              ol: ({ ordered, children, ...props }) => (
                  <ol className="list-decimal pl-4 font-bold text-sm md:text-base" {...props}>
                      {children}
                  </ol>
              ),
              li: ({ children, ...props }) => (
                  <li className="font-extralight text-sm md:text-base" {...props}>
                      {children}
                  </li>
              )
          }}
          className="prose prose-xs md:prose-sm dark:prose-invert text-xs md:text-sm"
      >
      {markdown}
    </ReactMarkdown>
  )
}

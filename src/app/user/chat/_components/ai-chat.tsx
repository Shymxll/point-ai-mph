'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from '@radix-ui/react-avatar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { QuestionDetailInsert, QuestionGroupDetails } from '@/commons/models/QuestionModels'
import openaiService from '@/commons/services/OpenaiService'
import { OpenaiResponse } from '@/commons/models/OpenaiModels'
import { useAuth } from '@/context/authContext'
import Image from 'next/image'
import React from 'react'
import { useToast } from '@/context/ToastContext'
import { StopCircleIcon, StopIcon } from '@heroicons/react/24/outline'
import useUserPromptGetList from '../libs/hooks/useUserPromptGetList'
import useUserBannedGetList from '../libs/hooks/useUserBannedGetList'
import { BannedMainManager } from '@/commons/models/BannedModels'
import { toast } from 'sonner'
import { convertMarkdownToPlainText } from '@/lib/markdown'
import { VoiceRecorder } from '@/components/ui/voice-recorder'
import { Textarea } from '@/components/ui/textarea'
import { StopCircle } from 'lucide-react';



interface AIChatProps {
  groupId: number | undefined | null
  chatItems: QuestionGroupDetails[]
  sendMessage: (data: QuestionDetailInsert) => void
}

export function AIChat({ groupId, chatItems, sendMessage }: AIChatProps) {
  const [messages, setMessages] = useState<QuestionGroupDetails[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStreamingText, setCurrentStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isStopped, setIsStopped] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const auth = useAuth()

  const { data, isLoading: promptLoading, error } = useUserPromptGetList();
  const { data: bannedData, isLoading: bannedLoading, error: bannedError } = useUserBannedGetList();
  // Scroll ref tanımlaması
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const [stopSignal, setStopSignal] = useState<AbortController | null>(null);

  useEffect(() => {
    setMessages(chatItems)
  }, [chatItems])

  useEffect(() => {
    // Son mesaja kaydırma işlemi
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])


  const sendAI = async (question: string): Promise<string> => {
    return openaiService.sendOpenaiRequest(
      [{
        role: 'system',
        content: bannedData?.data.map((banned: BannedMainManager) => banned.bannedName).join('\n') || ''
      },
      {
        content: question,
        role: 'user',
      }]).then((res: OpenaiResponse) => {
        const responseMessage = res.choices[0].message.content
        return responseMessage
      })
  }

  const streamText = async (text: string) => {
    setIsStreaming(true);
    setIsStopped(false);
    let currentText = '';

    // Yeni bir AbortController oluştur
    const controller = new AbortController();
    setStopSignal(controller);

    try {
      for (let i = 0; i < text.length; i += 5) {
        // AbortController sinyalini kontrol et
        if (controller.signal.aborted) {
          setIsStreaming(false);
          return { text: currentText, stopped: true };
        }

        currentText += text.slice(i, i + 5);
        setCurrentStreamingText(currentText);

        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        // Gecikme için Promise
        await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(resolve, 20);
          controller.signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(new Error('Streaming stopped'));
          });
        });
      }

      setCurrentStreamingText(text);
      setIsStreaming(false);
      return { text, stopped: false };
    } catch (error) {
      if (error instanceof Error && error.message === 'Streaming stopped') {
        return { text: currentText, stopped: true };
      }
      setIsStreaming(false);
      return { text: currentText, stopped: true };
    } finally {
      setStopSignal(null);
    }
  };

  const handleStop = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isStreaming || !stopSignal) return;

    stopSignal.abort();
    setIsStopped(true);
    setIsStreaming(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.trim()) {
      setIsLoading(true);
      const question = input;
      setInput('');

      const newMessage: QuestionGroupDetails = {
        question,
        answer: '',
        groupId: groupId || 0,
      };
      setMessages(prev => [...prev, newMessage]);

      try {
        const aiMessage = await sendAI(question);
        const { text: finalText, stopped } = await streamText(aiMessage);

        // Mesajı güncelle
        newMessage.answer = finalText;
        setMessages(prev => [...prev.slice(0, -1), newMessage]);

        // Mesajı gönder
        sendMessage({
          question,
          groupId: groupId || null,
          answer: finalText,
          userId: auth.user?.userId || '',
        });
      } catch (error) {
        toast.error("Bir hata oluştu");
      } finally {
        setIsLoading(false);
        setCurrentStreamingText('');
        setIsStopped(false);
        setIsStreaming(false);
        setStopSignal(null);
      }
    }
  };

  return (
    <div className="flex h-screen flex-col w-full justify-center overflow-hidden relative">
      <div className="flex-1 p-4 space-y-4 overflow-auto w-full h-screen items-end md:px-52 relative z-10">
        {messages.map((message: QuestionGroupDetails, index) => (
          <div key={index}>
            {/* Kullanıcı Mesajı */}
            <div className="flex justify-end mb-4">
              <div className="flex gap-3 items-center">
                <div
                  className="rounded-lg md:max-w-[600px] max-w-[300px] bg-gray-200  p-3 text-sm md:text-base break-words text-gray-800"
                >
                  {message?.question}
                </div>
                <Avatar className="w-5 h-5 border rounded-full bg-black hidden sm:block" />
              </div>
            </div>

            {/* AI Yanıtı */}
            <div className="flex justify-start mb-4">
              <div className="flex gap-3 items-center flex-row-reverse">
                <div className="rounded-lg max-w-[600px] bg-white p-3 text-sm break-words prose prose-sm dark:prose-invert">

                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({ children, ...props }) => (
                        <div className="flex flex-col gap-2 w-full ">
                          <pre className="bg-gray-800 md:my-1 text-white p-3 rounded-md w-[300px] md:w-full overflow-x-auto block text-sm md:text-base whitespace-pre-wrap"  {...props} >

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs border border-gray-500 rounded-md px-2 py-1 cursor-pointer">Kopyala</span>
                            </div>
                          </div>

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
                          : <code className="block w-full bg-gray-200 dark:bg-gray-800 p-3 rounded-md text-xs md:text-sm overflow-x-auto  whitespace-pre" {...props} />
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
                    {isStreaming && index === messages.length - 1
                      ? currentStreamingText
                      : message?.answer || ''}
                  </ReactMarkdown>
                </div>
                <Avatar className="w-5 h-5 border rounded-full bg-black hidden sm:block" />
              </div>
            </div>
          </div>
        ))}
        {/* Ref'i mesajların sonuna ekliyoruz */}
        <div ref={scrollRef} />
      </div>

      <div className=" p-4 bg-white relative z-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex gap-2 justify-center ">
              <div className="flex flex-col md:w-3/4 w-full border h-full bg-gray-100 rounded-md justify-center md:px-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="w-full pr-10  bg-gray-100 border-0 outline-none hover:outline-none resize-none rounded-md p-3 text-sm shadow-none focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none click"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim()) {
                        handleSubmit(e as any);
                      }
                    }
                  }}
                />
                <div className="flex justify-between items-center gap-2 m-2">
                  <VoiceRecorder
                    onTranscription={(text) => setInput(text)}
                    isDisabled={isLoading || isStreaming}
                  />
                  {isStreaming ? (
                    <Button
                      type="button"
                      onClick={handleStop}
                      className="bg-red-500 hover:bg-red-600 text-white gap-2"
                    >
                      <StopCircle className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="bg-white hover:bg-rose-700 hover:text-white text-primary"
                    >
                      {isLoading ? 'Düşünüyor...' : 'Gönder'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

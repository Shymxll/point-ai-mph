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
  const toast = useToast()
  const auth = useAuth()

  const { data, isLoading: promptLoading, error } = useUserPromptGetList();
  console.log("Prompt Data:", data);
  const { data: bannedData, isLoading: bannedLoading, error: bannedError } = useUserBannedGetList();
  console.log("Banned Data:", bannedData);
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
        toast.showToast("Bir hata oluştu", 'error');
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
      <div className="absolute inset-0 z-0">
        <Image
          src="/mphLogo.png"
          alt="background logo"
          layout="fill"
          objectFit="contain"
          className="opacity-5 w-full h-full py-20 pb-40"
        />
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-auto w-full h-screen items-end md:px-52 relative z-10">
        {messages.map((message: QuestionGroupDetails, index) => (
          <div key={index}>
            {/* Kullanıcı Mesajı */}
            <div className="flex justify-end mb-4">
              <div className="flex gap-3 items-center">
                <div
                  className="rounded-lg max-w-[600px] bg-primary text-primary-foreground p-3 text-sm break-words"
                >
                  {message?.question}
                </div>
                <Avatar className="w-5 h-5 border rounded-full bg-black hidden sm:block" />
              </div>
            </div>

            {/* AI Yanıtı */}
            <div className="flex justify-start mb-4">
              <div className="flex gap-3 items-center flex-row-reverse">
                <div className="rounded-lg max-w-[600px] bg-muted p-3 text-sm break-words prose prose-sm dark:prose-invert">
                  <div className="flex justify-end mb-2">
                    {
                      !isStreaming && !isStopped && !isSending &&
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(message.answer)
                          toast.showToast("Kopyalandı!", "success")
                        }}
                        disabled={isStreaming || isStopped || isSending}
                        hidden={isStreaming || isStopped || isSending}
                        className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-600"
                      >
                        Kopyala
                      </button>}
                  </div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({ ...props }) => (
                        <pre className="bg-gray-800 text-white p-3 rounded-md overflow-auto" {...props} />
                      ),
                      h1: ({ children, ...props }) => (
                        <h1 className="text-2xl font-bold py-2" {...props}>
                          {children}
                        </h1>
                      ),
                      h2: ({ children, ...props }) => (
                        <h2 className="text-xl font-bold py-2" {...props}>
                          {children}
                        </h2>
                      ),
                      h3: ({ children, ...props }) => (
                        <h3 className="text-lg font-bold py-2" {...props}>
                          {children}
                        </h3>
                      ),
                      h4: ({ children, ...props }) => (
                        <h4 className="text-base font-bold" {...props}>
                          {children}
                        </h4>
                      ),
                      h5: ({ children, ...props }) => (
                        <h5 className="text-sm font-bold" {...props}>
                          {children}
                        </h5>
                      ),
                      h6: ({ children, ...props }) => (
                        <h6 className="text-xs font-bold" {...props}>
                          {children}
                        </h6>
                      ),
                      p: ({ children, ...props }) => (
                        <p className="text-base" {...props}>
                          {children}
                        </p>
                      ),
                      strong: ({ children, ...props }) => (
                        <strong className="font-bold " {...props}>
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
                          ? <code className="bg-gray-200 dark:bg-gray-800 px-1 py-1 rounded" {...props} />
                          : <code className="block" {...props} />
                      ),
                      ol: ({ ordered, children, ...props }) => (
                        <ol className="list-decimal pl-4 font-bold" {...props}>
                          {children}
                        </ol>
                      ),
                      li: ({ children, ...props }) => (
                        <li className="font-extralight" {...props}>
                          {children}
                        </li>
                      )
                    }}
                    className="prose prose-sm dark:prose-invert text-base"
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

      <div className="border-t p-4 bg-primary relative z-10">
        <form onSubmit={handleSubmit} className="justify-center flex space-x-2 relative">
          
          <StopCircleIcon 
            className={`h-9 w-9 text-end text-white hover:text-primary hover:bg-white hover:rounded-md text-primary cursor-pointer justify-end ${!isStreaming && 'opacity-50 cursor-not-allowed'}`}
            onClick={isStreaming ? handleStop : undefined}
          />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="lg:max-w-[calc(100%-440px)] sm:max-w-full flex-1 text-base bg-white "
          />
          
          
          
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-white hover:bg-rose-700 hover:text-white text-primary"
          >
            {isLoading ? 'Düşünüyor...' : 'Gönder'}
          </Button>
        </form>
      </div>
    </div>
  )
}

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
  const auth = useAuth()

  // Scroll ref tanımlaması
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMessages(chatItems)
  }, [chatItems])

  useEffect(() => {
    // Son mesaja kaydırma işlemi
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  console.log('chatItems:', chatItems)

  const sendAI = async (question: string): Promise<string> => {
    return openaiService.sendOpenaiRequest({
      content: question,
      role: 'user',
    }).then((res: OpenaiResponse) => {
      const responseMessage = res.choices[0].message.content
      console.log('AI response:', responseMessage)
      return responseMessage
    })
  }

  const streamText = async (text: string) => {
    setIsStreaming(true)
    let currentText = ''

    for (let i = 0; i < text.length; i += 5) {
      currentText += text.slice(i, i + 5)
      setCurrentStreamingText(currentText)
      
      // Her güncelleme sonrası scroll
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' })
      }
      
      await new Promise(resolve => setTimeout(resolve, 20))
    }

    setIsStreaming(false)
    setCurrentStreamingText('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (input.trim()) {
      setIsLoading(true)
      
      // Mesajı ekle
      const newMessage: QuestionGroupDetails = {
        question: input,
        answer: '',
        groupId: groupId || 0,
      }
      setInput('')

      const aiMessage = await sendAI(input)

     
      setMessages(prev => [...prev, newMessage])

      // Streaming başlat
      await streamText(aiMessage)

      // Mesajı güncelle
      newMessage.answer = aiMessage

      setMessages(prev => [...prev.slice(0, -1), newMessage])

      sendMessage({
        question: input,
        groupId: groupId || null,
        answer: aiMessage,
        userId: auth.user?.userId || '',
      })

      setIsLoading(false)
      
    }
  }

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
                <Avatar className="w-5 h-5 border rounded-full bg-black" />
              </div>
            </div>

            {/* AI Yanıtı */}
            <div className="flex justify-start mb-4">
              <div className="flex gap-3 items-center flex-row-reverse">
                <div className="rounded-lg max-w-[600px] bg-muted p-3 text-sm break-words prose prose-sm dark:prose-invert">
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
                        <li className="font-base" {...props}>
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
                <Avatar className="w-5 h-5 border rounded-full bg-black" />
              </div>
            </div>
          </div>
        ))}
        {/* Ref'i mesajların sonuna ekliyoruz */}
        <div ref={scrollRef} />
      </div>

      <div className="border-t p-4 bg-primary relative z-10">
        <form onSubmit={handleSubmit} className="justify-center flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="lg:max-w-[calc(100%-440px)] sm:max-w-full flex-1 text-base bg-white"
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

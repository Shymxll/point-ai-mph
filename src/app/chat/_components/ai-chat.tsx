'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from '@radix-ui/react-avatar'
import { QuestionDetailInsert, QuestionGroupDetails } from '@/commons/models/QuestionModels'
import openaiService from '@/commons/services/OpenaiService'
import { OpenaiResponse } from '@/commons/models/OpenaiModels'
import { useAuth } from '@/context/authContext'
import { useQuestionGroupList } from '../hooks/useQuestionGroupList'
//TODO:chat group id aldım 
interface AIChatProps {
  groupId: number | undefined | null
  chatItems: QuestionGroupDetails[]
  sendMessage: (data: QuestionDetailInsert) => void
}

export function AIChat({ groupId, chatItems, sendMessage }: AIChatProps) {
  const [messages, setMessages] = useState<QuestionGroupDetails[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()
  const questionGroupList = useQuestionGroupList()

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      setIsLoading(true)

      const aiMessage = await sendAI(input)
      // TODO: chatgroup id ekledim
      sendMessage({
        question: input,
        groupId: groupId || null,
        answer: aiMessage,
        userId: auth.user?.userId || '',
      })
      setInput('')

      setIsLoading(false)
      if (chatItems.length === 0) {
        questionGroupList.refetch()
      }
    }
  }

  return (
    <div className="flex h-screen flex-col w-full justify-center overflow-hidden">
      <div className="flex-1 p-4 space-y-4 overflow-auto w-full h-screen items-end md:px-52">
        {messages.map((message: QuestionGroupDetails, index) => (
          <div key={index}>
            {/* Kullanıcı Mesajı */}
            <div className="flex justify-end mb-4">
              <div className="flex gap-3 items-center">
                <div
                  className="rounded-lg max-w-[600px] bg-primary text-primary-foreground p-3 text-sm break-words"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {message?.question}
                </div>
                <Avatar className="w-5 h-5 border rounded-full bg-black" />
              </div>
            </div>

            {/* AI Yanıtı */}
            <div className="flex justify-start mb-4">
              <div className="flex gap-3 items-center flex-row-reverse">
                <div
                  className="rounded-lg max-w-[600px] bg-muted p-3 text-sm break-words"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {message?.answer}
                </div>
                <Avatar className="w-5 h-5 border rounded-full bg-black" />
              </div>
            </div>
          </div>
        ))}
        {/* Ref'i mesajların sonuna ekliyoruz */}
        <div ref={scrollRef} />
      </div>

      <div className="border-t p-4 bg-primary">
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

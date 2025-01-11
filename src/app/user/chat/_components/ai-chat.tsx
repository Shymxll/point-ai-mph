'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { QuestionDetailInsert, QuestionGroupDetails } from '@/commons/models/QuestionModels'
import openaiService from '@/commons/services/OpenaiService'
import { OpenaiResponse } from '@/commons/models/OpenaiModels'
import { useAuth } from '@/context/authContext'
import React from 'react'
import useUserPromptGetList from '../libs/hooks/useUserPromptGetList'
import useUserBannedGetList from '../libs/hooks/useUserBannedGetList'
import { BannedMainManager } from '@/commons/models/BannedModels'
import { toast } from 'sonner'
import { convertMarkdownToPlainText } from '@/lib/markdown'
import { VoiceRecorder } from '@/components/ui/voice-recorder'
import { StopCircle } from 'lucide-react';
import MarkdownToHtml from '@/components/markdown-to-html'



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
  const [stockInput, setStockInput] = useState('')
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
    // Sistem mesajı
    const systemMessage = {
      role: 'system',
      content: `Sen Point AI'nın bir parçası olan yardımcı bir asistansın. 
      Yasaklı kelimeler: ${bannedData?.data.map((banned: BannedMainManager) => banned.bannedName).join(', ')}
      Bu kelimeleri kullanmaktan kaçın.`
    };

    // Önceki mesajları formatlayarak ekle
    const messageHistory = messages.map(msg => ({
      role: msg.question ? 'user' : 'assistant',
      content: "Soru: " + msg.question + " Cevap: " + msg.answer
    }));

    // Yeni soruyu ekle
    const currentMessage = {
      role: 'user',
      content: question
    };

    const oldMessagesAlert = {
      role: 'system',
      content: "Seninle eski mesajlarının da içinde bulunduğunu unutma.Benim sorduklarım `Soru` , senin cevapladığın `Cevap` olarak düşün."
    }
    // Tüm mesajları birleştir
    const allMessages = [
      systemMessage,
      oldMessagesAlert,
      ...messageHistory,
      currentMessage
    ];

    return openaiService.sendOpenaiRequest(allMessages).then((res: OpenaiResponse) => {
      const responseMessage = res.choices[0].message.content;
      return responseMessage;
    });
  };

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
                <Avatar className=' rounded-full border border-gray-200  w-8 h-8 justify-center items-center  hidden sm:block'>
                  {/* Kullanıcı avatarını görüntülemek için IconName'i kullanıyoruz */}
                  <AvatarImage alt="Kullanıcı" className='w-full h-full text-center justify-center items-center' />
                  <AvatarFallback className="font-bold flex items-center justify-center w-8 h-8">
                    {auth.user?.iconName || 'MPH'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* AI Yanıtı */}
            <div className="flex justify-start mb-4">
              <div className="flex gap-3 items-center flex-row-reverse">
                <div className="rounded-lg max-w-[600px] bg-white p-3 text-sm break-words prose prose-sm dark:prose-invert">

                 <MarkdownToHtml markdown={
                    isStreaming && index === messages.length - 1
                      ? currentStreamingText
                      : message?.answer || ''}
                  />
                </div>
                <Avatar className="rounded-full border border-gray-200  hidden sm:block">
                  <AvatarImage src="/mphLogo.png" alt="AI" width={30} height={30} />
                  <AvatarFallback className="font-bold">
                    AI
                  </AvatarFallback>
                </Avatar>
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
                    onTranscription={(text) => {
                      setInput(input + text);
                      setStockInput(input);

                    }}
                    onStart={() => {
                      setInput(input + ' ');
                      setStockInput(input);
                      setInput(input);

                    }}
                    onStop={() => {

                    }}

                    isDisabled={isLoading || isStreaming}
                  />
                  <div className="flex items-center gap-2"></div>
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

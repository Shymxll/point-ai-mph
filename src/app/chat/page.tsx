"use client";
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React, { useEffect } from 'react'
import { ChatSidebar, useQuestionGroupList } from './_components/side-bar'
import { AIChat } from './_components/ai-chat'
import { Navbar } from './_components/nav-bar'
import { useMutation } from '@tanstack/react-query';
import questionService from '@/commons/services/QuestionService';
import { QuestionDetailInsert, QuestionGroupDetails } from '@/commons/models/QuestionModels';

function Page() {

    const [messages, setMessages] = React.useState<QuestionGroupDetails[]>([])
    const [chatGroupId, setChatGroupId] = React.useState<string>('')

    function onChatGroupClick(chatGroupId: string) {
        setChatGroupId(chatGroupId)
        questionGroupDetailMutation.mutate(chatGroupId)
    }
    const questionGroupList = useQuestionGroupList()
    const questionGroupDetailMutation = useMutation({
        mutationKey: ['get-question-group-detail'],
        mutationFn: (groupId: string) => questionService.getQuestionDetailList({ groupId }),
        onSuccess: (data) => {
            setMessages(data.data.map((item, index) => ({
                id: index + 1,
                groupId: item.groupId || 0,
                question: item.question,
                answer: item.answer,
                getValue: 1
            })) || [])
        },
    })

    const insertQuestionDetailMutation = useMutation({
        mutationKey: ['insert-question-detail'],
        mutationFn: (data: QuestionDetailInsert) => questionService.insertQuestionDetail(data),
        onSuccess: (data,variables) => {
            console.log("Data:",data)
            setMessages([...messages, {
                id: 1,
                groupId: variables.groupId || 0,
                question: variables.question,
                answer: variables.answer,
                getValue: 1
            }])
            console.log("Data:",data)
            setChatGroupId(data.data.groupId)
            questionGroupList.refetch()
        },
    })
    console.log("GroupID:",chatGroupId)
    const sendMessage = (data: QuestionDetailInsert) => {
        insertQuestionDetailMutation.mutate(data)
    }

    useEffect(() => {

    }, [insertQuestionDetailMutation])



    const onNewChatGroupClick = () => {
        setChatGroupId('')
        setMessages([])
        questionGroupList.refetch()
    }
    //TODO:chat group id göndermeyi ekledim
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
                <ChatSidebar 
                    currentChatGroupId={chatGroupId}
                    onNewChatGroupClick={ onNewChatGroupClick }
                    onChatGroupClick={onChatGroupClick}
                />
                <SidebarInset className="h-screen overflow-hidden">
                    <Navbar />
                    <AIChat 
                        groupId={Number(chatGroupId)}
                        sendMessage={sendMessage}
                        chatItems={messages}
                    />
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

export default Page

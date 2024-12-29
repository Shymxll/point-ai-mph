'use client'

import * as React from 'react'

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import ChatGroup from './chat-group'
import { useQuery } from '@tanstack/react-query'
import questionService from '@/commons/services/QuestionService'
import { useAuth } from '@/context/authContext'
import { QuestionGroup } from '@/commons/models/QuestionModels'
import Image from 'next/image'
import { PlusCircleIcon } from '@heroicons/react/24/outline'


interface ChatSidebarProps {
    onChatGroupClick: (chatGroupId: string) => void
    onNewChatGroupClick: () => void
    currentChatGroupId?: string
}

export function useQuestionGroupList() {
    const auth = useAuth();
    return useQuery({
        queryKey: ['get-question-group-list'],
        queryFn: () => questionService.getQuestionGroupList(
            { userId: auth.user?.userId as string }
        ),
    });
}


export function ChatSidebar(
    {
        onChatGroupClick,
        onNewChatGroupClick,
        currentChatGroupId
    }: ChatSidebarProps
) {
    const questionGroupList = useQuestionGroupList()

    React.useEffect(() => {
        questionGroupList.refetch()
    }, [])
    return (
        <Sidebar

        >
            <SidebarHeader className='text-red-600 justify-between flex flex-row items-center font-bold text-2xl font-mono' >
                <div className='flex flex-row items-center'>
                    <Image src='/mphLogo.png' width={50} height={50} alt='logo' />

                    <div
                        className='text-white sm:text-white pl-2 md:text-red-700'
                    >Point AI</div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <div
                    onClick={() => onNewChatGroupClick()}
                    className="w-full px-4 justify-start
                    flex items-center p-2 rounded-md bg-popover cursor-pointer
                    hover:bg-popover-hover transition-colors duration-200 
                    hover:bg-slate-100 
                  "
                >
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Yeni Chat Grubu
                </div>
                <ScrollArea className="h-[calc(100vh-5rem)]"
                >
                    
                    <ChatGroup
                        currentChatGroupId={currentChatGroupId}
                        chats={
                            [
                                ...(Array.isArray(questionGroupList.data?.data) ? questionGroupList.data.data.map((group: QuestionGroup) => ({
                                    id: group.groupId,
                                    name: group.groupName,
                                    state: group.state,
                                })) : [])
                            ]
                        }
                        onChatGroupClick={
                            onChatGroupClick
                        }
                        onNewChatGroupClick={
                            onNewChatGroupClick
                        }
                    />
                </ScrollArea>
            </SidebarContent>
        </Sidebar>
    )
}



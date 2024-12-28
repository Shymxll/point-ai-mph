import { MessageCircle, PlusCircleIcon } from 'lucide-react';
import React from 'react'
import ChatGroupModel from './chat-group-model';

interface ChatGroupProps {
    chats: { id: string; name: string; state: string }[]
    onChatGroupClick: (chatGroupId: string) => void
    onNewChatGroupClick: () => void
    currentChatGroupId?: string
}



function ChatGroup(
    {
        chats,
        onChatGroupClick,
        onNewChatGroupClick,
        currentChatGroupId: currenChatGroupId

    }: ChatGroupProps
) {
    console.log('chats:', currenChatGroupId)
    return (
        <div className="space-y-1 flex flex-col
       p-2 w-full h-full overflow-y-auto">
            <div
                onClick={() => onNewChatGroupClick() }
                className="w-full px-4 justify-start
                    flex items-center p-2 rounded-md bg-popover cursor-pointer
                    hover:bg-popover-hover transition-colors duration-200 
                    hover:bg-slate-100 
                  "
            >
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Yeni Chat Grubu
            </div>
            {chats.slice().reverse().map((chat) => (
                <div
                    onClick={() => onChatGroupClick(chat.id)}
                    key={chat.id}
                    className={`w-full px-4 justify-start
                    flex items-center p-2 rounded-md bg-popover cursor-pointer
                    hover:bg-popover-hover transition-colors duration-200 
                    hover:bg-slate-100 ${currenChatGroupId === chat.id ? 'bg-slate-200' : ''} 
                  `}
                >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {chat.name}
                    <ChatGroupModel 
                        groupId={chat.id}
                        groupName={chat.name}
                        state={chat.state}

                    />
                </div>
            ))}
        </div>
    )
}

export default ChatGroup
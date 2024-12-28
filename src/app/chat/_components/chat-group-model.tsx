'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Edit3Icon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import questionService from '@/commons/services/QuestionService'
import { Switch } from '@/components/ui/switch'
import { Label } from '@radix-ui/react-dropdown-menu'

interface ChatGroupModelProps {
    groupId: string
    groupName: string
    state: string
}

function ChatGroupModel({ groupId, groupName }: ChatGroupModelProps) {
    const [inputValue, setInputValue] = useState(groupName)
    const [isOpen, setIsOpen] = useState(false)
    const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>()
    const [, setGroupState] = useState<{
        groupId: string
        groupName: string
        state: string
    } | null>(null)

    const queryClient = useQueryClient() // QueryClient'i başlatıyoruz

    const updateQuestionGroup = useMutation({
        mutationKey: ['update-question-group'],
        mutationFn: (data: { groupId: string; groupName: string; state: boolean }) =>
            questionService.updateQuestionGroup(data),
        onSuccess: () => {
            // Update işlemi başarılı olduğunda groupList'i refetch yapıyoruz
            queryClient.invalidateQueries();
        },
    })

    const getQuestionGroupById = useQuery({
        queryKey: ['get-question-group-by-id', groupId],
        queryFn: () => questionService.getQuestionGroupById({ groupId }),
    })

    useEffect(() => {
        if (getQuestionGroupById.isSuccess && getQuestionGroupById.data?.data) {
            setGroupState({
                groupId: getQuestionGroupById.data.data.groupId,
                groupName: getQuestionGroupById.data.data.groupName,
                state: getQuestionGroupById.data.data.state,
            })
            if (isSwitchChecked === undefined) {
                setIsSwitchChecked(Boolean(getQuestionGroupById.data.data.state))
            }
        }
    }, [getQuestionGroupById.data, getQuestionGroupById.isSuccess, isSwitchChecked])

    const handleSave = () => {
        setIsOpen(false)
        updateQuestionGroup.mutate({
            groupId,
            groupName: inputValue,
            state: isSwitchChecked ? true : false,
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Edit3Icon
                    className="ml-auto h-4 w-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    key={groupId}
                />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Yeniden Adlandır</DialogTitle>
                    <DialogDescription>Sohbet adını değiştirebilirsiniz.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <Input
                        id="name"
                        defaultValue={groupName}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Bir şeyler yazın..."
                        className="col-span-3"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSave() // Enter tuşuna basıldığında kaydet işlevini çalıştır
                            }
                        }}
                    />
                    <hr />
                    <div className="flex flex-row gap-4">
                        <Label>Sil</Label>
                        <Switch
                            defaultChecked={isSwitchChecked}
                            onCheckedChange={(checked) => {
                                setIsSwitchChecked(checked)
                            }}
                        />
                        {/* <Label>Aktif</Label> */}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSave}>Kaydet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ChatGroupModel

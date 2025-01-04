import { useMutation } from "@tanstack/react-query"
import { PromptUpdate } from "@/commons/models/PromptModels"
import promptService from "@/commons/services/PromptService"

export default function useAdminPromptUpdate(onSuccess: () => void, onError: () => void) {
    const mutation = useMutation({
        mutationFn: (prompt: PromptUpdate) => promptService.updatePrompt(prompt),
        onSuccess: () => {
            onSuccess()
        },
        onError: () => {
            onError()
        }
    })
    

    return mutation
}
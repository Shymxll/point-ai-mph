import { useToast } from "@/context/ToastContext"
import promptService from "@/commons/services/PromptService"
import { useMutation } from "@tanstack/react-query"
import { PromptInsert } from "@/commons/models/PromptModels"

export default function useAdminPromptInsert(onSuccess: () => void, onError: () => void) {
    const mutation = useMutation({
        mutationFn: (prompt: PromptInsert) => promptService.addPrompt(prompt),
        onSuccess: () => {
            onSuccess()
        },
        onError: () => {
            onError()
        }
    })

    return mutation
}


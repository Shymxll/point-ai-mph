import bannedService from "@/commons/services/BannedService"
import { BannedMainManager } from "@/commons/models/BannedModels"
import { useMutation } from "@tanstack/react-query"

export const useAdminBannedUpdate = (
    onSuccess: () => void,
    onError: (error: string) => void
) => {
    const updateMutation = useMutation({
        mutationFn: (banned: BannedMainManager) => bannedService.updateBanned(banned),
        onSuccess: () => {
            onSuccess()
        },
        onError: (error: string) => {
            onError(error)
        }
    })

    return updateMutation
}       

export default useAdminBannedUpdate

import { useMutation } from "@tanstack/react-query";
import bannedService from "@/commons/services/BannedService";
import { BannedMainManager } from "@/commons/models/BannedModels";

export const useAdminBannedInsert = (
    onSuccess: () => void,
    onError: () => void
) => {
    return useMutation({
        mutationKey: ['banned-prompts-admin-insert'],
        mutationFn: (values: BannedMainManager) => bannedService.addBanned(values),
        onSuccess: onSuccess,
        onError: onError
    })
}
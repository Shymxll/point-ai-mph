import bannedService from "@/commons/services/BannedService"
import { useQuery } from "@tanstack/react-query"

export const useAdminBannedGetById = (bannedId: number) => {
    const query = useQuery({
        queryKey: ['banned-prompts-admin-get-by-id'],
        queryFn: () => bannedService.getBannedById(bannedId)
    })

    return query
}

export default useAdminBannedGetById
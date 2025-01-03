import { useQuery } from "@tanstack/react-query";
import bannedService from "@/commons/services/BannedService";
import { BannedMainManager, BannedMainManagerListResponse } from "@/commons/models/BannedModels";

export default function useAdminBannedGetList() {
    return useQuery({
        queryKey: ['banned-prompts-admin-get-list'],
        queryFn: bannedService.getBannedList
    });
}
import { useQuery } from "@tanstack/react-query";
import promptService from "@/commons/services/PromptService";

export default function useAdminPromptGetList() {
    return useQuery({
        queryKey: ['prompt-list'],
        queryFn: promptService.getPromptList
    });
} 
import questionService from "@/commons/services/QuestionService";
import { useQuery } from "@tanstack/react-query";

export const useUserBannedGetList = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['user-banned-get-list'],
        queryFn: questionService.getBannedList,
    });

    return { data, isLoading, error };
}

export default useUserBannedGetList;
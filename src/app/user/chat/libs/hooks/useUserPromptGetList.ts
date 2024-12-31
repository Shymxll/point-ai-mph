import questionService from "@/commons/services/QuestionService";
import { useQuery } from "@tanstack/react-query";

export const useUserPromptGetList = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['user-prompt-get-list'],
        queryFn: questionService.getPromptList,
    });

    return { data, isLoading, error };
}

export default useUserPromptGetList;
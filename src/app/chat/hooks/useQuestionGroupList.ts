import questionService from "@/commons/services/QuestionService";
import { useAuth } from "@/context/authContext";
import { useQuery } from "@tanstack/react-query";


export function useQuestionGroupList() {
    const auth = useAuth();
    return useQuery({
        queryKey: ['get-question-group-list'],
        queryFn: () => questionService.getQuestionGroupList(
            { userId: auth.user?.userId as string }
        ),
    });
}
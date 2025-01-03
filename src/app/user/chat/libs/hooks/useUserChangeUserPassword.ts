import { useMutation } from "@tanstack/react-query"
import authService from "@/commons/services/AuthService"
import toast from "@/components/toast"

export const useUserChangeUserPassword = (
    onSuccess: () => void,
    onError: (error: unknown) => void
) => {

    const mutation = useMutation({
        mutationFn: authService.changeUserPassword,
        onSuccess: onSuccess,
        onError: onError
    })

    return mutation
}

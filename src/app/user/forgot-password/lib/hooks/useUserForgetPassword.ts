import authService from "@/commons/services/AuthService"
import { useMutation } from "@tanstack/react-query"


const useUserForgetPassword = (
    onSuccess: () => void,
    onError: (error: string) => void
) => {
    const  mutation = useMutation({
        mutationFn: (mail: string) => authService.forgetPassword(mail),
        onSuccess: () => {
            onSuccess()
        },
        onError: (error: string) => {
            onError(error)
        }
    })

    return mutation
}

export default useUserForgetPassword
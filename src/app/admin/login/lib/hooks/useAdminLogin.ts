import { UserLogin } from "@/commons/models/AuthModels";
import { useMutation } from "@tanstack/react-query";
import authService from "@/commons/services/AuthService";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";


export const useAdminLogin = () => {
    const router = useRouter();
    const { onSetAuthenticated, onSetUser } = useAuth();
    const { showToast } = useToast();

    const mutation = useMutation({
        mutationKey: ["admin-login"],
        mutationFn: (data: UserLogin) => authService.adminLogin(data),
        onSuccess: (data) => {
            onSetAuthenticated(true);
            onSetUser(data);
            router.push("/admin/dashboard/playground");
        },
        onError: () => {
            showToast("Hatalı giriş, Lütfen tekrar deneyiniz.", 'error');
        }
    });

    return mutation;
}

export default useAdminLogin;

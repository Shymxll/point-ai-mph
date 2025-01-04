import { UserLogin } from "@/commons/models/AuthModels";
import { useMutation } from "@tanstack/react-query";
import authService from "@/commons/services/AuthService";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export const useAdminLogin = () => {
    const router = useRouter();
    const { onSetAuthenticated, onSetUser } = useAuth();

    const mutation = useMutation({
        mutationKey: ["admin-login"],
        mutationFn: (data: UserLogin) => authService.adminLogin(data),
        onSuccess: (data) => {
            onSetAuthenticated(true);
            onSetUser(data);
            toast.success("Giriş başarılı, yönlendiriliyorsunuz...");
            router.push("/admin/dashboard/playground");
        },
        onError: () => {
            toast.error("Hatalı giriş, Lütfen tekrar deneyiniz.");
        }
    });

    return mutation;
}

export default useAdminLogin;

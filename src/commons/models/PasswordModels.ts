import * as z from "zod"

export const changePasswordSchema = z.object({
    currentPassword: z.string()
        .min(6, "Şifre en az 6 karakter olmalıdır"),
    newPassword: z.string()
        .min(6, "Yeni şifre en az 6 karakter olmalıdır")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
})

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema> 
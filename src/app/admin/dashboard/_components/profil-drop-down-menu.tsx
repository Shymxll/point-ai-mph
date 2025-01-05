import { Lock, LogOut, SquareUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import authService from "@/commons/services/AuthService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChangePasswordDialog } from "./change-password-dialog";

export default function ProfilDropDownMenu() {
    const router = useRouter();
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Logout">
                        <SquareUser className="size-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="ml-10">
                    <DropdownMenuItem >
                        <div onClick={
                            () => {
                                authService.logout()
                                router.push('/admin/login')
                            }
                        } className="flex items-center">
                            <LogOut className="mr-2 h-4 w-4" />
                            Çıkış Yap
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)}>
                        <div className="flex items-center">
                            <Lock className="mr-2 h-4 w-4" />
                            Şifremi Değiştir
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ChangePasswordDialog
                open={isChangePasswordOpen}
                onOpenChange={setIsChangePasswordOpen}
            />
        </>
    )
}

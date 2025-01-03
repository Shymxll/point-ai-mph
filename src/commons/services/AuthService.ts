import router from "next/router";
import { UserLogin, parseJwt, User, ChangeUserPassword } from "../models/AuthModels";
import api from "../utils/Api";
import tokenService, { AuthData } from "./TokenService";
class AuthService {
    // User login
    async userLogin(data: UserLogin): Promise<User> {
        const response = await api.post<unknown>("/user-login", { ...data });
        const authData = response.data as AuthData;
        const user = parseJwt(authData.accessToken);
        tokenService.setAuthData(response.data as AuthData);
        return user;
    }



    async logout() {
        tokenService.clearAuthData();
        router.push("/user/login");
        window.location.reload();
    }

    async adminLogin(data: UserLogin): Promise<User> {
        const response = await api.post<unknown>("/manager-login", { ...data });
        const authData = response.data as AuthData;
        const user = parseJwt(authData.accessToken);
        tokenService.setAuthData(response.data as AuthData);
        return user;
    }

    /*
        HTTP POST: api/user/change-user-password

        HTTP POST: api/user/change-user-password

        REQUEST:

        UserId INT
        OldPassword STRING
        NewPassword STRING
        DuplicateNewPassword STRING

        RESPONSE:

        StatusCode 200
    */
   async changeUserPassword(data: ChangeUserPassword): Promise<unknown> {
        const response = await api.post<unknown>("/user/change-user-password", { ...data });
        return response.data;
   }

   /*
    HTTP POST: api/user/forget-password/{mail}

    RESPONSE:

    StatusCode 200
   */
   async forgetPassword(mail: string): Promise<unknown> {
        const response = await api.post<unknown>(`/user/forget-password/${mail}`);
        return response;
   }
}

const authService = new AuthService();
export default authService;

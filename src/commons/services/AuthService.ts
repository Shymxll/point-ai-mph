import { UserLogin, parseJwt, User } from "../models/AuthModels";
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
    }
}

const authService = new AuthService();
export default authService;

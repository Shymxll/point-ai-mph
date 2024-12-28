import { parseJwt } from "../models/AuthModels";

export interface AuthData {
  accessToken: string;
  accessTokenExpiration: string;
  refreshToken: string;
  refreshTokenExpiration: string;
}

class TokenService {
  private storageKey = "authData";

  setAuthData(data: AuthData) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getAuthData(): AuthData | null {
    const authDataString = localStorage.getItem(this.storageKey);
    if (authDataString) {
      return JSON.parse(authDataString) as AuthData;
    }
    return null;
  }

  isAccessTokenExpired(): boolean {
    const authData = this.getAuthData();
    if (!authData) return true;

    const expirationTime = new Date(authData.accessTokenExpiration).getTime();
    const currentTime = new Date().getTime();
    return currentTime > expirationTime;
  }

  getUser() {
    const authData = this.getAuthData();
    if (!authData) return null;
    return parseJwt(authData.accessToken);
  }

  clearAuthData() {
    localStorage.removeItem(this.storageKey);
  }
}

const tokenService = new TokenService();
export default tokenService;

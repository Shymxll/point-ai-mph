import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import router from "next/router";
import tokenService from "../services/TokenService";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "/",
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const authToken = localStorage.getItem("authData");
        if (authToken) {
          const token = JSON.parse(authToken);
          const accessToken = token.accessToken;
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        config.headers["Access-Control-Allow-Origin"] = "*";
        return config;
      },
      (error) => Promise.reject(error),
    );
    this.api.interceptors.response.use(
      (response) => {       

        if (
          response.data &&
          response.data.statusCode &&
          response.data.statusCode === 400
        ) {

          const errorMessage = response.data.error?.errors[0];
          return Promise.reject({
            message: errorMessage,
            status: response.data.statusCode,
          });
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          if (window.location.pathname.includes("admin")) {
            window.location.href = "/admin/login";
          } else {
            window.location.href = "/user/login";
          }
        }
        return Promise.reject(error);
      },
    );
  }

  // GET
  public async get<T, R = AxiosResponse<T>>(
    path: string,
    params?: Record<string, unknown>,
  ): Promise<R> {
    const url = `/api/${path}`;
    const response = await this.api.get<R>(url, { params });
    return response.data;
  }

  // POST
  public async post<T, R = AxiosResponse<T>>(
    path: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const url = `/api/${path}`;
    const response = await this.api.post<R>(url, data, config);
    return response.data;
  }



  // PUT
  public async put<T, R = AxiosResponse<T>>(
    path: string,
    data: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const url = `/api/${path}`;
    const response = await this.api.put<R>(url, data, config);
    return response.data;
  }

  // DELETE
  public async delete<T, R = AxiosResponse<T>>(path: string): Promise<R> {
    const url = `/api/${path}`;
    const response = await this.api.delete<R>(url);
    return response.data;
  }
}

const api = new ApiService();
export default api;

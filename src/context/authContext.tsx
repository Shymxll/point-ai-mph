"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/commons/models/AuthModels";
import tokenService from "@/commons/services/TokenService";
import authService from "@/commons/services/AuthService";
import { isPathAllowed } from "@/commons/consts/allowedPath";

interface AuthContextProps {
    isAuthenticated: boolean | null;
    onSetAuthenticated: (value: boolean) => void;
    user: User | null;
    onSetUser: (value: User) => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const handleSetAuthenticated = (value: boolean) => {
        setIsAuthenticated(value);
    };

    const [user, setUser] = useState<User | null>(null);

    const handleSetUser = (value: User) => {
        setUser(value);
    };

    const router = useRouter();
    const pathname = usePathname();

    const checkAuth = () => {
        if (tokenService.isAccessTokenExpired()) {
            setIsAuthenticated(false);
            authService.logout();
        } else {
            setIsAuthenticated(true);
            setUser(tokenService.getUser());
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // Route protection

    useEffect(() => {
        if (!isPathAllowed(pathname) && isAuthenticated === false) {
            router.push("/user/login");
        }

        if (user) {
            if (
                !pathname.includes("login") &&
                !pathname.includes("admin") &&
                !pathname.includes("forgot-password")
            ) {
                router.push("/user/chat");
            }
        }
        // TODO: role check
    }, [pathname, isAuthenticated, router, user]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                onSetAuthenticated: handleSetAuthenticated,
                user,
                onSetUser: handleSetUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

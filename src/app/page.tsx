"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import tokenService from "@/commons/services/TokenService";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const authToken = !tokenService.isAccessTokenExpired();
    if (authToken) {
      router.push("/chat");
    }
  }, [router]);

  return null;
};

export default Page;

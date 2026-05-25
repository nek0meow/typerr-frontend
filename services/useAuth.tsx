"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_HOST, AppRoute } from "@/const/const";

interface UserData {
    username: string;
    email: string;
}

export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const res = await fetch(`${API_HOST}/auth/me`, {
                credentials: "include",
            });

            if (res.status === 401) {
                router.push(AppRoute.Login);
                return;
            }

            const data = await res.json();
            setUser(data);
            setLoading(false);
        })();
    }, []);

    return { user, loading };
}
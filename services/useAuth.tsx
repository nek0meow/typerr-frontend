"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
            const res = await fetch("http://localhost:8090/api/auth/me", {
                credentials: "include",
            });

            if (res.status === 401) {
                router.push("/login");
                return;
            }

            const data = await res.json();
            setUser(data);
            setLoading(false);
        })();
    }, []);

    return { user, loading };
}
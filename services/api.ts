import { API_HOST } from "@/const/const";
import { ProfileTestResult, TestStats } from "@/types/types";

export async function sendTestData(stats: TestStats, target: string) {
    fetch(`${API_HOST}/test`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            target,
            typed: stats.typed,
            time: stats.time,
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            timestamps_firsts: stats.timestamps_firsts
        }),
    })
}

export async function fetchProfileTestStats() {
    try {
        const res = await fetch(`${API_HOST}/profile_stats`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch test data');
        const profileTestStats: ProfileTestResult[] = await res.json();
        return profileTestStats;
    } catch (err) {
        console.error(err);
        throw err; // can be something more useful
    }
}


export async function sendRegistration(formData: { username: string, email: string, password: string }) {
    try {
        const res = await fetch(`${API_HOST}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
        });

        if (res.ok) {
            return Promise.resolve();
        } else {
            const message = await res.text();
            return Promise.reject(message || "Registration error");
        }
    } catch (err) {
        console.error(err);
        return Promise.reject("Network error");
    }
}

export async function sendLogin(formData: { email: string, password: string, rememberMe: boolean }) {
    const { email, password, rememberMe } = formData;
    try {
        const res = await fetch(`${API_HOST}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, rememberMe }),
            credentials: 'include'
        });

        if (res.ok) {
            Promise.resolve();
        } else {
            const text = await res.text();
            return Promise.reject(text || "Login failed");
        }
    } catch (err) {
        console.error(err);
        return Promise.reject("Network error");
    }
}

export async function sendLogout() {
    fetch(`${API_HOST}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
}

export async function fetchUser() {
    return await fetch(`${API_HOST}/auth/me`, {
        method: 'GET',
        credentials: "include",
    });
}
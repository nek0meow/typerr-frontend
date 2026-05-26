'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { API_HOST, AppRoute } from '@/const/const';
import { useRouter } from 'next/navigation';
import { sendLogin } from '@/services/api';

export default function Auth() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState("");



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // simple validation
        const email = formData.email as string;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email)) {
            setError("Invalid email");
            return;
        }

        setError("");

        try {
            await sendLogin(formData);
            router.push(AppRoute.Main);
        } catch (err) {
            setError((err as Error).message);
        }

    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit} method='POST'>
                {error && (<div className="mb-4 text-center bg-red-500 ">{error}</div>)}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="border p-2 mb-4 w-full block"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="border p-2 mb-4 w-full block"
                />

                <input
                    name="isRememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rememberMe: e.target.checked
                    }))}
                />
                <label htmlFor="isRememberMe">
                    Remember me
                </label>

                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-400 cursor-pointer">Login</button>
                <Link href="/register" className="block">
                    <button className="bg-blue-500  text-white p-2 rounded w-full hover:bg-blue-400 cursor-pointer">
                        To Register
                    </button>
                </Link>
            </form>
        </main>
    )
}

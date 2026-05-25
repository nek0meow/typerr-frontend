'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_HOST, AppRoute } from '@/const/const';

export default function Auth() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState("");
    const router = useRouter();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!emailRegex.test(formData.email.toUpperCase())) {
            setError("Invalid email");
            return;
        }

        setError("");

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
                router.push(AppRoute.Main);
            } else {
                const text = await res.text();
                setError(text || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            setError("Network error");
        }

    }


    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
            <h1 className="text-3xl font-bold mb-4">Register</h1>
            <form onSubmit={handleSubmit}>
                {error && (<div className="mb-4 text-center bg-red-500 ">{error}</div>)}
                <input
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    className="border p-2 mb-4 w-full block"
                />
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
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    onChange={handleChange}
                    className="border p-2 mb-4 w-full block"
                />

                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-400 cursor-pointer">Register</button>
                <Link href="/login" className="block">
                    <button className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-400 cursor-pointer">
                        To Login
                    </button>
                </Link>

            </form>
        </main>

    )
}

'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Auth() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        isRememberMe: false
    });
    const [error, setError] = useState("");
    const router = useRouter();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/

        if (!emailRegex.test(formData.email.toUpperCase())) {
            setError("Invalid email");
            return;
        }

        setError("");

        try {
            const res = await fetch('http://localhost:8090/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    isRememberMe: formData.isRememberMe
                }),
                credentials: 'include'
            });

            if (res.ok) {
                router.push('/main');
            } else {
                const text = await res.text();
                setError(text || "Login failed");
            }
        } catch (err) {
            console.error(err);
            setError("Network error");
        }

    }


    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit}>
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
                    onChange={handleChange}>
                </input>
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
        // TODO add 'remember me'
    )
}

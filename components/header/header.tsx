'use client'

import { API_HOST, AppRoute } from "@/const/const";
import { sendLogout } from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
    user?: {
        username: string;
    } | null;
}

export default function Header({ user }: HeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        sendLogout();
        router.push(AppRoute.Login);
    }

    return (
        <header className="w-full border-b border-gray-700 bg-gray-800 shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    href="/"
                    className="text-2xl font-bold text-white-900 hover:text-blue-500 transition"
                >
                    Typerr
                </Link>

                {user ? (
                    <div className="flex items-center gap-2 text-base font-medium">
                        <span className="text-white-700">
                            Logged in as
                        </span>

                        <Link
                            href="/profile"
                            className="text-blue-500 hover:text-blue-600 hover:underline"
                        >
                            {user.username}
                        </Link>

                        <button
                            className="bg-red-500 text-white hover: text-red-600 hover: underline hover: cursor-pointer"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link
                            href="/login"
                            className="text-gray-700 hover:text-blue-500"
                        >
                            Login
                        </Link>

                        <Link
                            href="/register"
                            className="text-gray-700 hover:text-blue-500"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
'use client'

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/services/useAuth';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { AppRoute } from '@/const/const';

type TestResultData = {
    id: number;
    wpm: number;
    time: number; // timestamp or test number
    createdAt?: string; // optional if backend returns it
};

export default function ProfileDashboard() {
    const { user, loading } = useAuth();
    const [testResults, setTestResults] = useState<TestResultData[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:8090/api/profile_stats', {
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to fetch test data');
                const data = await res.json();
                setTestResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading || loadingData) return <p>Loading...</p>;

    return (
        <div className="p-8 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Your WPM Over Time</h1>

            {testResults.length === 0 ? (
                <p>No test results yet</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={testResults}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="id" label={{ value: 'Test #', position: 'insideBottomRight', offset: 0 }} />
                        <YAxis label={{ value: 'WPM', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="wpm" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            )}

            <Link href={AppRoute.Main} className="block mt-6 w-full">
                <button className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-400">
                    To Tests
                </button>
            </Link>
        </div>
    );
}
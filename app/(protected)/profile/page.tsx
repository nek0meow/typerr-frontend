'use client'

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/services/useAuth';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { API_HOST, AppRoute } from '@/const/const';
import Header from '@/components/header/header';
import { fetchProfileTestStats } from '@/services/api';

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
            setLoadingData(true);
            const stats = await fetchProfileTestStats();
            setTestResults(stats);
            setLoadingData(false);
        };

        fetchData();
    }, [user]);

    if (loading || loadingData) return <p>Loading...</p>;

    return (<>
        <Header user={user} />
        <div className="p-8 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Your WPM Over Time</h1>

            {testResults.length === 0 ? (
                <p>No test results yet</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={testResults}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="id" label={{ value: 'Test #', position: 'insideBottomRight', offset: 0 }} />
                        <YAxis yAxisId='wpm' label={{ value: 'WPM', angle: -90, position: 'insideLeft' }} stroke='#8884d8' />
                        <YAxis yAxisId='acc' orientation='right' label={{ value: 'Acc', angle: 90, position: 'insideRight' }} stroke="#ff0f0f76" />
                        <Tooltip />
                        <Line yAxisId='wpm' type="monotone" dataKey="wpm" stroke="#8884d8" strokeWidth={2} />
                        <Line yAxisId='acc' type="monotone" dataKey="accuracy" stroke="#f3000049" strokeWidth={2} />
                    </LineChart>

                </ResponsiveContainer>
            )}

            <Link href={AppRoute.Main} className="block mt-6 w-full">
                <button className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-400">
                    To Tests
                </button>
            </Link>
        </div>
    </>
    );
}
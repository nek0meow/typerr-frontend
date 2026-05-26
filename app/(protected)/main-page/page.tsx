import React, { useState, useEffect, useRef } from 'react';
import MyInput from '@/components/input-field/input-field';
import StatsDashboard from '@/components/stats-dashboard/stats-dashboard';
import { formatTime } from '@/services/Time';
import { useAuth } from '@/services/useAuth';
import Header from '@/components/header/header';
import { calculateTestStats } from '@/util/stat';
import { sendTestData } from '@/services/api';
import { TestStats } from '@/types/types';


export default function MainPage() {
    const { user, loading } = useAuth();

    const [ended, setEnded] = useState(false);
    const [target, setTarget] = useState("The battle between foxes and cats in cuteness is as eternal as the struggle between light and darkness.");
    const [timer, setTimer] = useState(0);
    const startTime = useRef(performance.now());
    const [stats, setStats] = useState<TestStats | null>(null);

    useEffect(() => {
        if (ended) return;

        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    const handleEnd = (timestamps: { key: string; timestamp: number }[], typed: string) => {
        const timeTotal = performance.now() - startTime.current;
        const newStats = calculateTestStats(timestamps, typed, target, timeTotal, startTime.current);
        setStats(newStats);
        sendTestData(newStats, target);
        setEnded(true);
    }

    function handleStart() {
        setEnded(false);
        // TODO: make it a server query
        setStats(null);
        setTarget("In a world where technology and nature collide, the harmony of existence is tested by the relentless march of progress.");
        setTimer(0);
        startTime.current = performance.now();
    }


    if (loading) return <p>Loading...</p>;
    return (
        <div className="min-h-screen">
            <Header user={user} />
            <div className="flex flex-col items-center justify-center p-8">
                {!ended ? (
                    <>
                        <div>{formatTime(timer)}</div>
                        <MyInput
                            target={target}
                            onEnd={handleEnd} />
                    </>
                ) : (
                    stats && <StatsDashboard stats={stats} />
                )
                }
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                    onClick={handleStart}>
                    Start new test
                </button>
            </div>
        </div>
    )

}


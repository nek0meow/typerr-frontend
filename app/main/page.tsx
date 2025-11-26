'use client'

import React, { useState, useEffect, useRef } from 'react';
import MyInput from '@/components/MyInput';
import StatsDashboard from '@/components/StatsDashboard';
import Link from 'next/link';
import { formatTime } from '@/services/Time';
import { useAuth } from '@/services/useAuth';

export type Stats = {
    timestamps: { key: string; timestamp: number }[];
    typed: string;
    time: number;
    wpm: number;
    accuracy: number;
    accuracy_fixed: number;
    timestamps_firsts: { key: string; timestamp: number; correct: boolean }[]; 
};


export default function Main() {
    const { user, loading } = useAuth();
    
    const [ended, setEnded] = useState(false);
    const [target, setTarget] = useState("The battle between foxes and cats in cuteness is as eternal as the struggle between light and darkness.");
    const [timer, setTimer] = useState(0);
    const startTime = useRef(performance.now());
    const [stats, setStats] = useState<Stats | null>(null);
    
    useEffect(() => {
        if (ended) return;
        
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);
    
    
    const handleEnd = (timestamps: { key: string; timestamp: number }[], typed: string) =>  {
        let timeTotal = performance.now() - startTime.current;
        const newStats = calculateTestStats(timestamps, typed, timeTotal);
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
    
    function calculateTestStats(timestamps: { key: string; timestamp: number }[], typed: string, time: number) {
        
        // accuracy (fixed) calc
        let ptr = 0;
        let errors = 0;
        while (ptr < target.length && ptr < typed.length) {
            if (target[ptr] != typed[ptr]) {
                errors++;
            }
            ptr++;
        }
        
        // offsetting timestamps rel to 0
        const relative = timestamps.map(entry => ({
            key: entry.key,
            timestamp: entry.timestamp - startTime.current
        }));
        
        // processing tstmp of only first attempts
        let cursor = 0;
        let maxCursor = -1;
        let timestamps_firsts = [];
        
        for (const e of relative) {
            if (e.key === "Backspace") {
                cursor = Math.max(cursor - 1, 0);
                continue;
            }
            
            if (e.key.length === 1) {
                const isNewPosition = cursor > maxCursor;
                
                if (isNewPosition) {
                    const correct = e.key === target[cursor];
                    timestamps_firsts.push({key: e.key, timestamp: e.timestamp, correct});
                    maxCursor = cursor;
                }
                cursor++;
            }
        }

        ptr = 0;
        let true_errors = 0;
        while (ptr < target.length && ptr < timestamps_firsts.length) {
            if (target[ptr] != timestamps_firsts[ptr].key) {
                true_errors++;
            }
            ptr++;
        }

        
        let accuracy_fixed = (target.length - errors) / target.length * 100;
        let accuracy = (target.length - true_errors) / target.length * 100;
        let wpm = (typed.length / 5) / (time / 60000);
        
        const res = {timestamps: relative, typed, time, wpm, accuracy, accuracy_fixed, timestamps_firsts};
        return res;
    }


    async function sendTestData(stats: Stats, target: string) {
        fetch("http://localhost:8090/api/test", {
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
    
    if (loading) return <p>Loading...</p>;
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
            {user && (
                <div className="absolute top-4 right-4 text-lg font-semibold">
                    Hello,{' '}
                    <Link href="/profile" className="text-blue-500 hover:underline">
                        {user.username}
                    </Link>
                    !
                </div>
            )}
            {!ended ? (
            <>
                <div>{formatTime(timer)}</div>
                <MyInput
                    target={target}
                    onEnd={handleEnd}/>
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
    )

}


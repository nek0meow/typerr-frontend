'use client'

import React, { useState, useEffect, useRef } from 'react';
import MyInput from '@/components/MyInput';
import StatsDashboard from '@/components/StatsDashboard';
import { start } from 'repl';
import { formatTime } from '@/services/Time';
import { useAuth } from '@/services/useAuth';

export type Stats = {
    timestamps: { key: string; timestamp: number }[];
    typed: string;
    time: number;
    wpm: number;
    accuracy: number;
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
        calculateTestStats(timestamps, typed, timeTotal);
        setEnded(true);
    }
    
    function handleStart() {
        setEnded(false);
        // TODO: make it a server query
        setTarget("In a world where technology and nature collide, the harmony of existence is tested by the relentless march of progress. ");
        setTimer(0);
        startTime.current = performance.now();
    }
    
    function calculateTestStats(timestamps: { key: string; timestamp: number }[], typed: string, time: number) {
        
        // accuracy calc
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
        
        let accuracy = (target.length - errors) / target.length * 100;
        let wpm = (typed.length / 5) / (time / 60000);
        
        setStats({timestamps: relative, typed, time, wpm, accuracy, timestamps_firsts});
    }
    
    if (loading) return <p>Loading...</p>;
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
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


'use client'

import React, { useState, useEffect } from 'react';
import MyInput from '@/components/MyInput';

export default function Main() {
    const [ended, setEnded] = useState(false);
    const [target, setTarget] = useState("The battle between foxes and cats in cuteness is as eternal as the struggle between light and darkness.");
    const [timer, setTimer] = useState(0);
    useEffect(() => {
        if (ended) return;

        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
        }, []);


    function formatTime(seconds: number) {
        const mm = Math.floor(seconds / 60);
        const ss = seconds % 60;

        return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
    }

    function handleEnd() {
        setEnded(true);
    }

    function handleStart() {
        setEnded(false);
        // TODO: make it a server query
        setTarget("In a world where technology and nature collide, the harmony of existence is tested by the relentless march of progress.");
        

    }

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
                <p>stats</p>
            )
            }
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleStart}>
                Start new test
            </button>
        </div>
    )

}


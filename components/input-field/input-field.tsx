import React, { useState, useRef } from 'react';
import { useEffect } from 'react';

interface MyInputProps {
    target: string;
    onEnd: (timestamps: { key: string; timestamp: number }[], typed: string) => void;
}

export default function InputField({ target, onEnd }: MyInputProps) {
    const [typed, setTyped] = useState("");
    const keyTimestamps = useRef<{ key: string, timestamp: number }[]>([]);
    const finished = useRef(false);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        const key = e.key;
        const now = performance.now();

        if (key == "Backspace") {
            setTyped(prev => prev.slice(0, -1));
            keyTimestamps.current.push({ key: key, timestamp: now });
            return;
        }

        if (key.length !== 1) {
            return;
        }

        keyTimestamps.current.push({ key: key, timestamp: now });
        setTyped(prev => prev + key);
    }

    function getCharState(index: number) {
        if (index >= typed.length) return "pending";

        return typed[index] === target[index]
            ? "correct"
            : "incorrect";
    }

    useEffect(() => {
        if (!finished.current && typed.length >= target.length) {
            finished.current = true;
            onEnd(keyTimestamps.current, typed);
        }
    }, [typed, target.length, onEnd]);


    return (
        <div
            className="border border-black-400 p-2 focus:border-blue-500"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            autoFocus
        >
            {target.split("").map((ch, i) => (
                <span key={i} className={getCharState(i)}>
                    {ch}
                </span>
            ))}
        </div>
    )
}

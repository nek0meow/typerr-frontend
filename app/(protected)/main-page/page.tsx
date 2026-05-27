import React, { useState, useEffect, useRef } from 'react';
import MyInput from '@/components/input-field/input-field';
import StatsDashboard from '@/components/stats-dashboard/stats-dashboard';
import { formatTime } from '@/services/Time';
import { useAuth } from '@/services/useAuth';
import Header from '@/components/header/header';
import { calculateTestStats } from '@/util/stat';
import { fetchRecommendedText, sendTestData } from '@/services/api';
import { TestStats } from '@/types/types';


export default function MainPage() {
    const { user, loading } = useAuth();

    const [ended, setEnded] = useState(false);
    const [target, setTarget] = useState("Configure your test. This is just an example of text. The battle between foxes and cats in cuteness is as eternal as the struggle between light and darkness.");
    const [timer, setTimer] = useState(0);
    const [stats, setStats] = useState<TestStats | null>(null);
    const [testStartForm, setTestStartForm] = useState({
        relevantWordCount: 15,
        totalWordCount: 30,
        lastN: 100
    });
    const [testId, setTestId] = useState(1);
    const startTime = useRef(performance.now());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        if (intervalRef.current) return;
        startTime.current = performance.now();

        intervalRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
    }

    const handleEnd = (timestamps: { key: string; timestamp: number }[], typed: string) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        const timeTotal = performance.now() - startTime.current;
        const newStats = calculateTestStats(timestamps, typed, target, timeTotal, startTime.current);
        setStats(newStats);
        if (newStats.accuracy > 80) {
            sendTestData(newStats, target);
        }
        setEnded(true);
    }

    async function handleChangeTest(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        const { relevantWordCount, totalWordCount, lastN } = testStartForm;

        const text = await fetchRecommendedText({ relevantWordCount, totalWordCount, lastN });
        setEnded(false);
        setStats(null);
        setTarget(text);
        setTimer(0);
        setTestId(prev => prev + 1); // force react to re-render input
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
                            key={testId}
                            target={target}
                            onEnd={handleEnd}
                            onFirstKeyPress={() => startTimer()}
                        />
                    </>
                ) : (
                    <>
                        {stats && <StatsDashboard stats={stats} />}
                    </>
                )}

                <form
                    onSubmit={handleChangeTest}
                    method="post"
                    className="w-full border-y-4 border-blue-500 bg-zinc-950 px-8 py-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                >
                    <div className="flex flex-wrap items-end gap-8">
                        <div className="flex flex-col gap-3">
                            <label
                                htmlFor="recommendedCount"
                                className="text-[10px] uppercase tracking-widest text-blue-300"
                            >
                                Difficult Words
                            </label>

                            <input
                                id="recommendedCount"
                                name="recommendedCount"
                                type="number"
                                value={testStartForm.relevantWordCount}
                                onChange={(e) =>
                                    setTestStartForm({
                                        ...testStartForm,
                                        relevantWordCount: Number(e.target.value),
                                    })
                                }
                                className="w-40 border-2 border-blue-500 bg-black px-3 py-3 text-sm text-white outline-none transition focus:bg-zinc-900 focus:shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label
                                htmlFor="totalCount"
                                className="text-[10px] uppercase tracking-widest text-blue-300"
                            >
                                Total Words
                            </label>

                            <input
                                id="totalCount"
                                name="totalCount"
                                type="number"
                                value={testStartForm.totalWordCount}
                                onChange={(e) =>
                                    setTestStartForm({
                                        ...testStartForm,
                                        totalWordCount: Number(e.target.value),
                                    })
                                }
                                className=" w-40 border-2 border-blue-500 bg-black px-3 py-3 text-sm text-white outline-none transition focus:bg-zinc-900 focus:shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label
                                htmlFor="lastN"
                                className="text-[10px] uppercase tracking-widest text-blue-300"
                            >
                                Recent Tests
                            </label>

                            <input
                                id="lastN"
                                name="lastN"
                                type="number"
                                value={testStartForm.lastN}
                                onChange={(e) =>
                                    setTestStartForm({
                                        ...testStartForm,
                                        lastN: Number(e.target.value),
                                    })
                                }
                                className=" w-40 border-2 border-blue-500 bg-black px-3 py-3 text-sm text-white outline-none transition focus:bg-zinc-900 focus:shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                            />
                        </div>

                        <button
                            type="submit"
                            className=" h-[52px] border-2 border-blue-400 bg-blue-600 px-8 text-xs uppercase tracking-widest text-white transition hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] active:translate-y-[2px]"
                        >
                            Start New Test
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )

}


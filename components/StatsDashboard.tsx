'use client'

import React, { useState, useRef } from 'react';
import type { Stats } from '@/app/main/page';
import { formatTime } from '@/services/Time';

type StatsDashboardProps = {
    stats: Stats;
};

export default function StatsDashboard({ stats }: StatsDashboardProps) {
    return (
        <div className="p-6 border rounded-lg w-[400px] text-center space-y-4">

            <h2 className="text-2xl font-bold">Results</h2>

            <div className="flex justify-between">
                <span className="font-semibold">Time:</span>
                <span>{formatTime(stats.time / 1000)}</span>
            </div>

            <div className="flex justify-between">
                <span className="font-semibold">WPM:</span>
                <span>{stats.wpm?.toFixed(1) ?? "-"}</span>
            </div>

            <div className="flex justify-between">
                <span className="font-semibold">Accuracy:</span>
                <span>{stats.accuracy?.toFixed(1) ?? "-"}%</span>
            </div>

            <hr />

            <details>
                <summary className="cursor-pointer text-blue-600">
                    Detailed keystrokes
                </summary>

                <ul className="text-left text-sm mt-2 space-y-1 max-h-[150px] overflow-auto">
                    {stats.timestamps.map((t, i) => (
                        <li key={i}>
                            <span className="font-mono">{t.key}</span> – {t.timestamp} ms
                        </li>
                    ))}
                </ul>
            </details>

        </div>
    );
}

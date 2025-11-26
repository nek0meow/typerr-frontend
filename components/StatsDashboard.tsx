'use client'

import type { Stats } from '@/app/main/page';
import { formatTime } from '@/services/Time';
import { speedColor } from '@/services/ResultVisualization';

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
                <span>{stats.wpm.toFixed(1) ?? "-"}</span>
            </div>

            <div className="flex justify-between">
                <span className="font-semibold">Accuracy:</span>
                <span>{stats.accuracy_fixed.toFixed(1) ?? "-"}%</span>
            </div>

            <div className="flex justify-between">
                <span className="font-semibold">True accuracy:</span>
                <span>{stats.accuracy.toFixed(1) ?? "-"}%</span>
            </div>

            <hr />

            <ul className="tracking-wide font-mono text-lg">
                {stats.timestamps_firsts.map((t, i) => {
                    if (!t.key) return null;

                    // compute delta since previous first key
                    const delta = i === 0 ? 0 : t.timestamp - stats.timestamps_firsts[i - 1].timestamp;

                    // determine color
                    const color = t.correct
                    ? speedColor(delta)     
                    : "rgb(200, 50, 50)";  

                    return (
                    <span key={i} style={{ color }}>
                        {t.key}
                    </span>
                    );
                })}
                </ul>
        </div>
    );
}

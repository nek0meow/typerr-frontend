import { TestStats } from "@/types/types";

export function calculateTestStats(
    timestamps: { key: string; timestamp: number }[],
    typed: string,
    target: string,
    time: number,
    startTime: number) {

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
        timestamp: entry.timestamp - startTime
    }));

    // processing tstmp of only first attempts
    let cursor = 0;
    let maxCursor = -1;
    const timestamps_firsts = [];

    for (const e of relative) {
        if (e.key === "Backspace") {
            cursor = Math.max(cursor - 1, 0);
            continue;
        }

        if (e.key.length === 1) {
            const isNewPosition = cursor > maxCursor;

            if (isNewPosition) {
                const correct = e.key === target[cursor];
                timestamps_firsts.push({ key: e.key, timestamp: e.timestamp, correct });
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

    const accuracy_fixed = (target.length - errors) / target.length * 100;
    const accuracy = (target.length - true_errors) / target.length * 100;
    const wpm = (typed.length / 5) / (time / 60000);

    const res: TestStats = {
        timestamps: relative,
        timestamps_firsts,
        typed,
        time,
        wpm,
        accuracy,
        accuracy_fixed,
    };
    return res;
}
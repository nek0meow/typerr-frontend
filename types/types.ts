export type TestStats = {
    timestamps: { key: string; timestamp: number }[];
    timestamps_firsts: { key: string; timestamp: number; correct: boolean }[];
    typed: string;
    time: number;
    wpm: number;
    accuracy: number;
    accuracy_fixed: number;
};

export type ProfileTestResult = {
    id: number;
    wpm: number;
    accuracy: number;
    time: number;
    savedAt: Date;
}
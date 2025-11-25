export function formatTime(seconds: number) {
    const mm = Math.floor(seconds / 60);
    const ss = seconds % 60;

    return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}
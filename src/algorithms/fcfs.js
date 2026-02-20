/**
 * First Come First Served (FCFS) Scheduling
 * Non-preemptive: processes are executed in order of arrival time.
 * @param {Array} processes - Array of { id, arrivalTime, burstTime, priority }
 * @returns {{ gantt: Array, results: Array }}
 */
export function fcfs(processes) {
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime || a.id - b.id)
    const gantt = []
    const results = []
    let currentTime = 0

    for (const p of sorted) {
        if (currentTime < p.arrivalTime) {
            currentTime = p.arrivalTime
        }
        const start = currentTime
        const end = currentTime + p.burstTime
        gantt.push({ pid: p.id, start, end })
        const waitingTime = start - p.arrivalTime
        const turnaroundTime = end - p.arrivalTime
        results.push({ id: p.id, arrivalTime: p.arrivalTime, burstTime: p.burstTime, priority: p.priority, waitingTime, turnaroundTime })
        currentTime = end
    }

    return { gantt, results }
}
/**
 * Shortest Job First (SJF) - Non-preemptive
 * At each decision point, selects the process with the shortest burst time
 * among all arrived processes.
 * @param {Array} processes
 * @returns {{ gantt: Array, results: Array }}
 */
export function sjf(processes) {
    const remaining = processes.map(p => ({ ...p }))
    const gantt = []
    const resultMap = {}
    let currentTime = 0
    let completed = 0
    const n = remaining.length

    while (completed < n) {
        const available = remaining.filter(p => !p.done && p.arrivalTime <= currentTime)

        if (available.length === 0) {
            // CPU idle: jump to next arrival
            const next = remaining.filter(p => !p.done).sort((a, b) => a.arrivalTime - b.arrivalTime)[0]
            currentTime = next.arrivalTime
            continue
        }

        // Pick shortest burst; tie-break by arrival time then id
        available.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime || a.id - b.id)
        const p = available[0]
        const start = currentTime
        const end = currentTime + p.burstTime
        gantt.push({ pid: p.id, start, end })
        const waitingTime = start - p.arrivalTime
        const turnaroundTime = end - p.arrivalTime
        resultMap[p.id] = { id: p.id, arrivalTime: p.arrivalTime, burstTime: p.burstTime, priority: p.priority, waitingTime, turnaroundTime }
        p.done = true
        currentTime = end
        completed++
    }

    const results = processes.map(p => resultMap[p.id])
    return { gantt, results }
}
/**
 * Priority Scheduling - Non-preemptive
 * Lower priority number = higher priority (1 is highest).
 * At each decision point, selects the process with the highest priority
 * (lowest priority number) among all arrived processes.
 * @param {Array} processes
 * @returns {{ gantt: Array, results: Array, starvationRisk: boolean }}
 */
export function priorityScheduling(processes) {
    const remaining = processes.map(p => ({ ...p }))
    const gantt = []
    const resultMap = {}
    let currentTime = 0
    let completed = 0
    const n = remaining.length

    while (completed < n) {
        const available = remaining.filter(p => !p.done && p.arrivalTime <= currentTime)

        if (available.length === 0) {
            const next = remaining.filter(p => !p.done).sort((a, b) => a.arrivalTime - b.arrivalTime)[0]
            currentTime = next.arrivalTime
            continue
        }

        // Lower number = higher priority; tie-break by arrival, then id
        available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime || a.id - b.id)
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

    // Starvation risk: any process waited > 3× its burst time
    const starvationRisk = Object.values(resultMap).some(r => r.waitingTime > 3 * r.burstTime)
    const results = processes.map(p => resultMap[p.id])
    return { gantt, results, starvationRisk }
}
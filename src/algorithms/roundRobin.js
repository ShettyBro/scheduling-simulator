/**
 * Round Robin Scheduling
 * Preemptive: each process runs for at most `quantum` time units before
 * being preempted and placed at the back of the ready queue.
 * @param {Array} processes
 * @param {number} quantum - Time quantum
 * @returns {{ gantt: Array, results: Array }}
 */
export function roundRobin(processes, quantum) {
    const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime, firstRun: -1 }))
    const gantt = []
    const finishTime = {}
    let currentTime = 0
    const queue = []
    const enqueued = new Set()

    // Sort by arrival initially
    const sorted = [...remaining].sort((a, b) => a.arrivalTime - b.arrivalTime || a.id - b.id)

    // Enqueue processes that arrive at time 0
    for (const p of sorted) {
        if (p.arrivalTime <= currentTime && !enqueued.has(p.id)) {
            queue.push(p)
            enqueued.add(p.id)
        }
    }

    while (queue.length > 0 || remaining.some(p => p.remainingTime > 0 && !enqueued.has(p.id))) {
        if (queue.length === 0) {
            // CPU idle
            const nextArrival = sorted.filter(p => !enqueued.has(p.id)).sort((a, b) => a.arrivalTime - b.arrivalTime)[0]
            if (!nextArrival) break
            currentTime = nextArrival.arrivalTime
            // Enqueue newly arrived
            for (const p of sorted) {
                if (p.arrivalTime <= currentTime && !enqueued.has(p.id)) {
                    queue.push(p)
                    enqueued.add(p.id)
                }
            }
            continue
        }

        const p = queue.shift()
        const execTime = Math.min(quantum, p.remainingTime)
        const start = currentTime
        const end = currentTime + execTime
        gantt.push({ pid: p.id, start, end })
        p.remainingTime -= execTime
        currentTime = end

        // Enqueue new arrivals during this slice
        for (const proc of sorted) {
            if (proc.arrivalTime > start && proc.arrivalTime <= currentTime && !enqueued.has(proc.id)) {
                queue.push(proc)
                enqueued.add(proc.id)
            }
        }

        if (p.remainingTime > 0) {
            queue.push(p)
        } else {
            finishTime[p.id] = end
        }
    }


    const results = processes.map(p => {
        const ft = finishTime[p.id] ?? currentTime
        const turnaroundTime = ft - p.arrivalTime
        const waitingTime = turnaroundTime - p.burstTime
        return { id: p.id, arrivalTime: p.arrivalTime, burstTime: p.burstTime, priority: p.priority, waitingTime, turnaroundTime }
    })

    return { gantt, results }
}
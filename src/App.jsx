import React, { useState, useCallback } from 'react'
import ProcessTable from './components/ProcessTable.jsx'
import AlgorithmSelector from './components/AlgorithmSelector.jsx'
import GanttChart from './components/GanttChart.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import { fcfs } from './algorithms/fcfs.js'
import { sjf } from './algorithms/sjf.js'
import { priorityScheduling } from './algorithms/priority.js'
import { roundRobin } from './algorithms/roundRobin.js'

const ALGO_INFO = {
    fcfs: {
        name: 'First Come First Served',
        short: 'FCFS',
        description:
            'Processes are executed in exact arrival order. No preemption — once a process starts, it runs to completion.',
        complexity: 'O(n log n)',
        insight: 'Simple but suffers from the "convoy effect" — short processes wait behind long ones, yielding high average waiting times.',
        starvation: false,
        icon: '→',
        accent: 'from-cyan-500 to-blue-600',
        accentBorder: 'border-cyan-500/30',
        accentGlow: 'shadow-cyan-500/20',
    },
    sjf: {
        name: 'Shortest Job First',
        short: 'SJF',
        description:
            'Selects the process with the shortest burst time from the ready queue. Provably optimal for minimizing average waiting time.',
        complexity: 'O(n²)',
        insight: 'Optimal average waiting time among non-preemptive algorithms, but requires prior knowledge of burst times.',
        starvation: false,
        icon: '⬇',
        accent: 'from-violet-500 to-purple-600',
        accentBorder: 'border-violet-500/30',
        accentGlow: 'shadow-violet-500/20',
    },
    priority: {
        name: 'Priority Scheduling',
        short: 'Priority',
        description:
            'Each process has a priority number (lower = higher priority). CPU is always allocated to the highest-priority ready process.',
        complexity: 'O(n²)',
        insight: 'Critical for real-time systems. Aging (gradually increasing priority over time) mitigates starvation.',
        starvation: true,
        icon: '★',
        accent: 'from-amber-500 to-orange-600',
        accentBorder: 'border-amber-500/30',
        accentGlow: 'shadow-amber-500/20',
    },
    rr: {
        name: 'Round Robin',
        short: 'Round Robin',
        description:
            'Assigns a fixed time quantum to each process in a cyclic order. When quantum expires, the process is preempted and placed at the back of the queue.',
        complexity: 'O(n)',
        insight: 'Most fair algorithm for time-sharing. Performance heavily depends on quantum — too small causes excessive context switching.',
        starvation: false,
        icon: '↺',
        accent: 'from-emerald-500 to-teal-600',
        accentBorder: 'border-emerald-500/30',
        accentGlow: 'shadow-emerald-500/20',
    },
}

const DEFAULT_PROCESSES = [
    { id: 1, arrivalTime: 0, burstTime: 5, priority: 2 },
    { id: 2, arrivalTime: 2, burstTime: 3, priority: 1 },
    { id: 3, arrivalTime: 4, burstTime: 8, priority: 3 },
    { id: 4, arrivalTime: 6, burstTime: 2, priority: 1 },
]

function validate(processes) {
    const errors = []
    for (const p of processes) {
        if (p.arrivalTime < 0) errors.push(`P${p.id}: Arrival time cannot be negative.`)
        if (p.burstTime <= 0) errors.push(`P${p.id}: Burst time must be greater than 0.`)
        if (p.priority < 1) errors.push(`P${p.id}: Priority must be ≥ 1.`)
    }
    return errors
}

function runAlgorithm(algorithm, processes, quantum) {
    switch (algorithm) {
        case 'fcfs': return fcfs(processes)
        case 'sjf': return sjf(processes)
        case 'priority': return priorityScheduling(processes)
        case 'rr': return roundRobin(processes, quantum)
        default: return { gantt: [], results: [] }
    }
}

// ── Metric Card ──────────────────────────────────────────────────
function MetricCard({ label, value, unit, colorClass, glowClass, icon }) {
    return (
        <div className={`glass rounded-2xl p-5 flex flex-col gap-2 animate-fade-up border ${colorClass} shadow-lg ${glowClass}`}>
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40">{label}</p>
                <span className="text-lg">{icon}</span>
            </div>
            <div className="flex items-end gap-1.5">
                <span className="text-3xl font-bold font-mono text-white">{value}</span>
                {unit && <span className="text-xs text-white/40 mb-1 font-mono">{unit}</span>}
            </div>
        </div>
    )
}

// ── Main App ─────────────────────────────────────────────────────
export default function App() {
    const [darkMode, setDarkMode] = useState(true)
    const [processes, setProcesses] = useState(DEFAULT_PROCESSES)
    const [algorithm, setAlgorithm] = useState('fcfs')
    const [quantum, setQuantum] = useState(2)
    const [result, setResult] = useState(null)
    const [errors, setErrors] = useState([])
    const [isRunning, setIsRunning] = useState(false)

    const handleSimulate = useCallback(() => {
        const errs = validate(processes)
        if (errs.length) {
            setErrors(errs)
            setResult(null)
            return
        }
        setErrors([])
        setIsRunning(true)
        setTimeout(() => {
            const output = runAlgorithm(algorithm, processes, quantum)
            setResult(output)
            setIsRunning(false)
        }, 120) // brief delay for animation feel
    }, [processes, algorithm, quantum])

    const info = ALGO_INFO[algorithm]
    const avgWT = result?.results ? (result.results.reduce((s, r) => s + r.waitingTime, 0) / result.results.length).toFixed(2) : null
    const avgTAT = result?.results ? (result.results.reduce((s, r) => s + r.turnaroundTime, 0) / result.results.length).toFixed(2) : null

    const cpuUtil = result ? (() => {
        const totalBurst = processes.reduce((s, p) => s + p.burstTime, 0)
        const totalTime = result.gantt[result.gantt.length - 1]?.end || 1
        return ((totalBurst / totalTime) * 100).toFixed(1) + '%'
    })() : null

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="relative min-h-screen overflow-x-hidden transition-colors duration-500
                dark:bg-[#080b14]
                bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">

                {/* ── Animated Background Blobs (dark only) ── */}
                <div className="dark:block hidden pointer-events-none fixed inset-0 overflow-hidden -z-0">
                    <div className="animate-blob absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full
                        bg-gradient-to-br from-cyan-600/20 to-blue-700/20 blur-3xl" />
                    <div className="animate-blob-delay-2 absolute top-1/3 -right-32 w-[420px] h-[420px] rounded-full
                        bg-gradient-to-br from-violet-600/15 to-purple-700/15 blur-3xl" />
                    <div className="animate-blob-delay-4 absolute -bottom-32 left-1/3 w-[380px] h-[380px] rounded-full
                        bg-gradient-to-br from-indigo-600/15 to-cyan-700/10 blur-3xl" />
                </div>

                {/* ── Grid overlay texture (dark only) ── */}
                <div className="dark:block hidden pointer-events-none fixed inset-0 -z-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* ── Header ── */}
                <header className="sticky top-0 z-30
                    dark:glass-strong dark:border-b dark:border-white/5
                    bg-white/80 backdrop-blur-xl border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Logo mark */}
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg
                                bg-gradient-to-br from-cyan-400 to-violet-600 glow-cyan">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" />
                                    <path d="M8 21h8M12 17v4" />
                                    <path d="M7 8h1M11 8h1M15 8h1M7 12h10" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-base font-bold dark:text-white text-slate-900 leading-tight tracking-tight">
                                    CPU Scheduling Simulator
                                </h1>
                                <p className="text-[10px] font-mono dark:text-white/30 text-slate-400 tracking-widest uppercase">
                                    Operating Systems · Postgraduate
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setDarkMode(d => !d)}
                            className="w-9 h-9 rounded-xl glass flex items-center justify-center
                                dark:text-white/50 dark:hover:text-white
                                text-slate-500 hover:text-slate-700
                                border dark:border-white/10 border-slate-200
                                hover:scale-105 transition-all duration-200"
                            title="Toggle dark / light mode"
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                </header>

                {/* ── Main Content ── */}
                <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

                    {/* ── Top Grid: Config + Process Table ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* Left column: Algorithm Selector + Info */}
                        <div className="lg:col-span-2 space-y-4">

                            {/* Algorithm Selector Card */}
                            <div className="glass-light dark:glass rounded-2xl p-5 shadow-xl dark:shadow-black/30">
                                <p className="text-[10px] font-bold uppercase tracking-widest dark:text-white/30 text-slate-400 mb-4">
                                    Configuration
                                </p>
                                <AlgorithmSelector
                                    algorithm={algorithm}
                                    setAlgorithm={alg => { setAlgorithm(alg); setResult(null); setErrors([]) }}
                                    quantum={quantum}
                                    setQuantum={setQuantum}
                                />
                            </div>

                            {/* Algorithm Info Card */}
                            <div className={`glass-light dark:glass rounded-2xl p-5 shadow-xl dark:shadow-black/30 space-y-3 border dark:${info.accentBorder} border-slate-200`}>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br ${info.accent} text-white shadow-md`}>
                                            {info.icon}
                                        </span>
                                        <h3 className="font-semibold dark:text-white text-slate-800 text-sm leading-snug">{info.name}</h3>
                                    </div>
                                    <span className="flex-shrink-0 text-[11px] font-mono
                                        dark:bg-white/5 dark:text-white/40 dark:border dark:border-white/10
                                        bg-slate-100 text-slate-500 border border-slate-200
                                        px-2 py-0.5 rounded-lg">
                                        {info.complexity}
                                    </span>
                                </div>
                                <p className="text-xs dark:text-white/50 text-slate-500 leading-relaxed">{info.description}</p>
                                <div className="rounded-xl dark:bg-white/5 dark:border dark:border-white/8 bg-sky-50 border border-sky-100 p-3">
                                    <p className="text-xs dark:text-cyan-300 text-sky-700 leading-relaxed">
                                        <span className="font-semibold">💡 Insight: </span>{info.insight}
                                    </p>
                                </div>
                                {info.starvation && (
                                    <div className="rounded-xl dark:bg-red-500/10 dark:border dark:border-red-500/20 bg-red-50 border border-red-100 p-3">
                                        <p className="text-xs dark:text-red-300 text-red-700 leading-relaxed">
                                            <span className="font-semibold">⚠️ Starvation Risk: </span>
                                            Low-priority processes may wait indefinitely. Use aging to mitigate.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right column: Process Table */}
                        <div className="lg:col-span-3 glass-light dark:glass rounded-2xl p-5 shadow-xl dark:shadow-black/30">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest dark:text-white/30 text-slate-400">
                                    Process Queue
                                </p>
                                <span className="text-[11px] font-mono
                                    dark:bg-white/5 dark:text-white/40 dark:border dark:border-white/10
                                    bg-slate-100 text-slate-500 border border-slate-200
                                    px-2.5 py-1 rounded-lg">
                                    {processes.length} processes
                                </span>
                            </div>
                            <ProcessTable
                                processes={processes}
                                setProcesses={p => { setProcesses(p); setResult(null) }}
                                algorithm={algorithm}
                            />
                        </div>
                    </div>

                    {/* ── Validation Errors ── */}
                    {errors.length > 0 && (
                        <div className="glass rounded-2xl p-4 border border-red-500/30 bg-red-500/10 animate-fade-up">
                            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <span>⛔</span> Validation Errors
                            </p>
                            <ul className="space-y-1">
                                {errors.map((e, i) => (
                                    <li key={i} className="text-xs text-red-300 font-mono">• {e}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ── Run Button ── */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleSimulate}
                            disabled={isRunning}
                            className={`group relative px-10 py-3.5 rounded-2xl font-semibold text-sm text-white
                                bg-gradient-to-r from-cyan-500 to-violet-600
                                hover:from-cyan-400 hover:to-violet-500
                                shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40
                                hover:scale-[1.03] active:scale-95
                                transition-all duration-200
                                disabled:opacity-60 disabled:cursor-wait
                                flex items-center gap-2`}
                        >
                            {isRunning ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Simulating…
                                </>
                            ) : (
                                <>
                                    <span>▶</span>
                                    Run Simulation
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* ── Results Section ── */}
                    {result && (
                        <div className="space-y-6">
                            {/* Metric Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <MetricCard label="Avg Waiting" value={avgWT} unit="ms" icon="⏱" colorClass="border-amber-500/25" glowClass="shadow-amber-500/10" />
                                <MetricCard label="Avg Turnaround" value={avgTAT} unit="ms" icon="🔄" colorClass="border-emerald-500/25" glowClass="shadow-emerald-500/10" />
                                <MetricCard label="Processes" value={result.results.length} unit="total" icon="⚙️" colorClass="border-cyan-500/25" glowClass="shadow-cyan-500/10" />
                                <MetricCard label="CPU Utilization" value={cpuUtil} unit="" icon="📊" colorClass="border-violet-500/25" glowClass="shadow-violet-500/10" />
                            </div>

                            {/* Starvation Warning */}
                            {result.starvationRisk && (
                                <div className="glass rounded-2xl p-4 border border-orange-500/30 bg-orange-500/10 flex gap-3 animate-fade-up">
                                    <span className="text-2xl">⚠️</span>
                                    <div>
                                        <p className="text-sm font-semibold text-orange-300">Starvation Detected</p>
                                        <p className="text-xs text-orange-400/80 mt-0.5 leading-relaxed">
                                            One or more low-priority processes waited significantly longer than their burst time.
                                            Consider implementing an aging mechanism to prevent indefinite postponement.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Gantt Chart */}
                            <div className="glass-light dark:glass rounded-2xl p-5 shadow-xl dark:shadow-black/30 animate-fade-up">
                                <p className="text-[10px] font-bold uppercase tracking-widest dark:text-white/30 text-slate-400 mb-4">
                                    Gantt Chart
                                </p>
                                <GanttChart gantt={result.gantt} processes={processes} />
                            </div>

                            {/* Results Table */}
                            <div className="glass-light dark:glass rounded-2xl p-5 shadow-xl dark:shadow-black/30 animate-fade-up-delay">
                                <p className="text-[10px] font-bold uppercase tracking-widest dark:text-white/30 text-slate-400 mb-4">
                                    Scheduling Results
                                </p>
                                <ResultsTable results={result.results} />
                            </div>

                            {/* Comparison Insight */}
                            <div className="glass-light dark:glass rounded-2xl p-5 shadow-xl dark:shadow-black/30
                                border-l-4 border-l-cyan-500 animate-fade-up-delay">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest dark:text-cyan-400 text-cyan-600 mb-2 flex items-center gap-2">
                                    <span>📊</span> Comparison Insight
                                </h3>
                                <p className="text-sm dark:text-white/60 text-slate-600 leading-relaxed">
                                    {algorithm === 'fcfs' && `FCFS produced an average waiting time of ${avgWT}ms. For this workload, consider SJF to potentially reduce average waiting time if burst times are known in advance.`}
                                    {algorithm === 'sjf' && `SJF achieved ${avgWT}ms average waiting — theoretically optimal among non-preemptive algorithms. In practice, burst time estimation is required.`}
                                    {algorithm === 'priority' && `Priority Scheduling resulted in ${avgWT}ms average waiting time. If starvation occurs, aging (incrementing priority of waiting processes) is recommended.`}
                                    {algorithm === 'rr' && `Round Robin with quantum=${quantum} produced ${avgWT}ms average waiting time. Experiment with different quantum values — smaller quanta improve fairness but increase context-switch overhead.`}
                                </p>
                            </div>
                        </div>
                    )}
                </main>

                {/* ── Footer ── */}
                <footer className="relative z-10 text-center py-8 text-[11px] font-mono dark:text-white/20 text-slate-400 tracking-widest uppercase">
                    CPU Scheduling Simulator · Postgraduate OS Lab · React + Vite
                </footer>
            </div>
        </div>
    )
}
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
                <p className="text-xs font-bold uppercase tracking-widest dark:text-white/40 text-slate-600">{label}</p>
                <span className="text-lg">{icon}</span>
            </div>
            <div className="flex items-end gap-1.5">
                <span className="text-3xl font-bold font-mono dark:text-white text-slate-900">{value}</span>
                {unit && <span className="text-xs dark:text-white/40 text-slate-500 mb-1 font-mono">{unit}</span>}
            </div>
        </div>
    )
}

// ── Main App ─────────────────────────────────────────────────────
export default function App() {
    const [darkMode, setDarkMode] = useState(true)
    const [processes, setProcesses] = useState(DEFAULT_PROCESSES)

    // Sync dark mode with document root for Tailwind 'class' strategy
    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

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
        }, 300) // Slightly longer for a more "processing" feel
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
                dark:bg-[#080b14] bg-white">

                {/* ── Background Blobs ── */}
                <div className="fixed inset-0 overflow-hidden -z-0 pointer-events-none">
                    <div className="animate-blob absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full
                        dark:bg-cyan-600/20 bg-cyan-200/40 blur-[100px]" />
                    <div className="animate-blob-delay-2 absolute top-1/3 -right-32 w-[520px] h-[520px] rounded-full
                        dark:bg-violet-600/15 bg-violet-200/40 blur-[100px]" />
                    <div className="animate-blob-delay-4 absolute -bottom-32 left-1/3 w-[480px] h-[480px] rounded-full
                        dark:bg-indigo-600/15 bg-blue-100/40 blur-[100px]" />
                </div>

                {/* ── Grid texture (Subtle) ── */}
                <div className="pointer-events-none fixed inset-0 -z-0 opacity-[0.05] dark:opacity-[0.1]"
                    style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                {/* ── Header ── */}
                <header className="sticky top-0 z-30 transition-all duration-300
                    dark:glass-strong dark:border-b dark:border-white/10
                    bg-white/70 backdrop-blur-2xl border-b border-slate-200 shadow-sm">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg
                                bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 glow-cyan">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" />
                                    <path d="M8 21h8M12 17v4" />
                                    <path d="M7 8h1M11 8h1M15 8h1M7 12h10" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold dark:text-white text-slate-900 leading-tight tracking-tight">
                                    CPU Scheduling Simulator
                                </h1>
                                <p className="text-[10px] font-bold dark:text-white/30 text-slate-500 tracking-[0.2em] uppercase">
                                    Built by <a href="https://sudeepbro.works/" target="_blank"
                                        className="dark:text-white/40 text-slate-500 hover:text-cyan-500 transition-colors duration-300">ShettyBro</a>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setDarkMode(d => !d)}
                            className="group w-10 h-10 rounded-xl flex items-center justify-center
                                dark:bg-white/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10
                                bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200
                                border dark:border-white/10 border-slate-200
                                transition-all duration-300 shadow-sm hover:shadow-md"
                            title="Toggle dark / light mode"
                        >
                            <span className="text-lg group-hover:rotate-12 transition-transform">{darkMode ? '☀️' : '🌙'}</span>
                        </button>
                    </div>
                </header>

                {/* ── Main Content ── */}
                <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

                    {/* ── Config Grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                        <div className="lg:col-span-2 space-y-6">
                            {/* Algorithm Switcher */}
                            <div className="glass-light dark:glass rounded-3xl p-6 shadow-2xl dark:shadow-none animate-fade-up">
                                <p className="text-[11px] font-bold uppercase tracking-[0.15em] dark:text-white/40 text-slate-500 mb-5">
                                    Select Algorithm
                                </p>
                                <AlgorithmSelector
                                    algorithm={algorithm}
                                    setAlgorithm={alg => { setAlgorithm(alg); setResult(null); setErrors([]) }}
                                    quantum={quantum}
                                    setQuantum={setQuantum}
                                />
                            </div>

                            {/* Details Card */}
                            <div className={`glass-light dark:glass rounded-3xl p-6 shadow-2xl dark:shadow-none animate-fade-up border dark:${info.accentBorder} border-slate-200/50`}>
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${info.accent} text-white shadow-xl`}>
                                            {info.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold dark:text-white text-slate-900 text-base leading-none mb-1">{info.name}</h3>
                                            <p className="text-[10px] font-mono dark:text-white/40 text-slate-500">{info.short}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-3 py-1 rounded-full">
                                        <span className="text-xs font-mono dark:text-white/60 text-slate-600 font-bold">{info.complexity}</span>
                                    </div>
                                </div>
                                <p className="text-sm dark:text-white/60 text-slate-600 leading-relaxed mb-4">{info.description}</p>
                                <div className="rounded-2xl dark:bg-white/5 bg-blue-50/50 border dark:border-white/10 border-blue-100/50 p-4">
                                    <p className="text-xs dark:text-cyan-200 text-blue-800 leading-relaxed italic">
                                        <span className="font-bold not-italic">Insight: </span>{info.insight}
                                    </p>
                                </div>
                                {info.starvation && (
                                    <div className="mt-4 rounded-2xl dark:bg-red-500/10 bg-red-50 border dark:border-red-500/20 border-red-100 p-4">
                                        <p className="text-xs dark:text-red-300 text-red-700 leading-relaxed font-medium">
                                            ⚠️ Starvation Risk detected. Aging is recommended for production use.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Process Queue */}
                        <div className="lg:col-span-3 glass-light dark:glass rounded-3xl p-6 shadow-2xl dark:shadow-none animate-fade-up">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] dark:text-white/40 text-slate-500">
                                        Process Queue
                                    </p>
                                    <h2 className="text-lg font-bold dark:text-white text-slate-900">Manage Tasks</h2>
                                </div>
                                <div className="dark:bg-white/5 bg-slate-900/5 px-4 py-1.5 rounded-full border dark:border-white/10 border-black/5">
                                    <span className="text-xs font-bold dark:text-white/80 text-slate-900 font-mono">
                                        {processes.length} Active
                                    </span>
                                </div>
                            </div>
                            <ProcessTable
                                processes={processes}
                                setProcesses={p => { setProcesses(p); setResult(null) }}
                                algorithm={algorithm}
                            />
                        </div>
                    </div>

                    {/* Simulation Errors */}
                    {errors.length > 0 && (
                        <div className="glass rounded-2xl p-5 border border-red-500/30 bg-red-500/5 animate-fade-up shadow-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">!</span>
                                <p className="text-sm font-bold text-red-500 uppercase tracking-widest">Input Errors</p>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                                {errors.map((e, i) => (
                                    <li key={i} className="text-xs dark:text-red-300 text-red-600 font-medium">• {e}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* CTA Button */}
                    <div className="flex justify-center pt-2">
                        <button
                            onClick={handleSimulate}
                            disabled={isRunning}
                            className={`group relative px-12 py-4 rounded-3xl font-bold text-base text-white
                                bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600
                                hover:from-cyan-400 hover:via-blue-500 hover:to-violet-500
                                shadow-[0_20px_50px_rgba(6,182,212,0.3)] hover:shadow-[0_20px_50px_rgba(6,182,212,0.5)]
                                hover:-translate-y-1 active:scale-95
                                transition-all duration-300
                                disabled:opacity-50 disabled:cursor-wait disabled:hover:translate-y-0
                                flex items-center gap-3`}
                        >
                            {isRunning ? (
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <span className="group-hover:rotate-12 transition-transform">⚡</span>
                            )}
                            {isRunning ? 'Processing...' : 'Run Simulation'}
                        </button>
                    </div>

                    {/* Results Table Section */}
                    {result && (
                        <div className="space-y-8 py-4 animate-fade-up">
                            {/* Summary Metrics */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <MetricCard label="Waiting Time" value={avgWT} unit="ms" icon="🕒" colorClass="border-amber-500/30" glowClass="shadow-amber-500/10" />
                                <MetricCard label="Turnaround" value={avgTAT} unit="ms" icon="🔄" colorClass="border-emerald-500/30" glowClass="shadow-emerald-500/10" />
                                <MetricCard label="Throughput" value={result.results.length} unit="jobs" icon="🔥" colorClass="border-cyan-500/30" glowClass="shadow-cyan-500/10" />
                                <MetricCard label="Efficiency" value={cpuUtil} unit="" icon="⚡" colorClass="border-violet-500/30" glowClass="shadow-violet-500/10" />
                            </div>

                            {/* Gantt View */}
                            <div className="glass-light dark:glass rounded-3xl p-8 shadow-2xl dark:shadow-none relative">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] dark:text-white/40 text-slate-500">
                                        Time-flow Analysis
                                    </p>
                                    <h3 className="text-xl font-bold dark:text-white text-slate-900">Gantt Chart</h3>
                                </div>
                                <GanttChart gantt={result.gantt} processes={processes} />
                            </div>

                            {/* Detailed Statistics */}
                            <div className="glass-light dark:glass rounded-3xl p-8 shadow-2xl dark:shadow-none">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] dark:text-white/40 text-slate-500">
                                        Execution Logs
                                    </p>
                                    <h3 className="text-xl font-bold dark:text-white text-slate-900">Results Overview</h3>
                                </div>
                                <ResultsTable results={result.results} />
                            </div>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="text-center py-12 px-6">
                    <div className="max-w-xs mx-auto h-[1px] bg-gradient-to-r from-transparent via-slate-500/20 to-transparent mb-6" />
                    <p className="text-[10px] dark:text-white/20 text-slate-400 tracking-[0.3em] uppercase">
                        CopyRight © 2026 · Built by <a href="https://sudeepbro.works/" target="_blank" className="dark:text-white/40 text-slate-500 hover:text-cyan-500 transition-colors duration-300">ShettyBro</a>
                    </p>
                </footer>
            </div>
        </div>
    )
}
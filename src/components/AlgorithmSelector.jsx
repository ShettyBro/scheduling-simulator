import React from 'react'

const ALGORITHMS = [
    { value: 'fcfs', label: 'FCFS', icon: '→' },
    { value: 'sjf', label: 'SJF', icon: '⬇' },
    { value: 'priority', label: 'Priority', icon: '★' },
    { value: 'rr', label: 'Round Robin', icon: '↺' },
]

const ACCENTS = {
    fcfs: 'from-cyan-500 to-blue-500 shadow-cyan-500/30',
    sjf: 'from-violet-500 to-purple-600 shadow-violet-500/30',
    priority: 'from-amber-500 to-orange-500 shadow-amber-500/30',
    rr: 'from-emerald-500 to-teal-500 shadow-emerald-500/30',
}

export default function AlgorithmSelector({ algorithm, setAlgorithm, quantum, setQuantum }) {
    return (
        <div className="space-y-5">
            {/* Algorithm pill tabs */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest dark:text-white/30 text-slate-500 mb-3">
                    Algorithm Selection
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {ALGORITHMS.map(a => {
                        const isActive = algorithm === a.value
                        return (
                            <button
                                key={a.value}
                                onClick={() => setAlgorithm(a.value)}
                                className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                                    ${isActive
                                        ? `bg-gradient-to-r ${ACCENTS[a.value]} text-white shadow-lg scale-[1.02]`
                                        : 'dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/60 dark:hover:text-white dark:border dark:border-white/8 bg-slate-200/50 hover:bg-slate-200 text-slate-700 border border-slate-300/50 hover:border-slate-400/50'
                                    }
                                `}
                            >
                                <span className="text-base leading-none">{a.icon}</span>
                                <span className="text-[13px]">{a.label}</span>
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Time Quantum (RR only) */}
            {algorithm === 'rr' && (
                <div className="animate-fade-up">
                    <p className="text-[10px] font-bold uppercase tracking-widest dark:text-white/30 text-slate-500 mb-3">
                        Time Quantum
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setQuantum(q => Math.max(1, q - 1))}
                            className="w-9 h-9 rounded-xl dark:glass dark:text-white/60 dark:hover:text-white
                                bg-slate-100 text-slate-500 hover:bg-slate-200
                                border dark:border-white/10 border-slate-200
                                font-bold text-base flex items-center justify-center transition-all hover:scale-105"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            min="1"
                            value={quantum}
                            onChange={e => setQuantum(Math.max(1, Number(e.target.value)))}
                            className="flex-1 dark:glass dark:text-white dark:border-white/10 dark:placeholder-white/20
                                bg-slate-100 text-slate-800 border border-slate-200
                                rounded-xl px-4 py-2.5 text-center font-mono font-bold text-lg
                                focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                                transition-all"
                        />
                        <button
                            onClick={() => setQuantum(q => q + 1)}
                            className="w-9 h-9 rounded-xl dark:glass dark:text-white/60 dark:hover:text-white
                                bg-slate-100 text-slate-500 hover:bg-slate-200
                                border dark:border-white/10 border-slate-200
                                font-bold text-base flex items-center justify-center transition-all hover:scale-105"
                        >
                            +
                        </button>
                    </div>
                    <p className="text-[10px] dark:text-white/20 text-slate-400 mt-2 text-center">
                        ms per time slice
                    </p>
                </div>
            )}
        </div>
    )
}
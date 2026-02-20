import React, { useMemo } from 'react'

// Gradient pairs for process blocks — vivid & distinct
const PROCESS_GRADIENTS = [
    { from: '#06b6d4', to: '#3b82f6' }, // cyan → blue
    { from: '#8b5cf6', to: '#ec4899' }, // violet → pink
    { from: '#10b981', to: '#14b8a6' }, // emerald → teal
    { from: '#f59e0b', to: '#f97316' }, // amber → orange
    { from: '#ef4444', to: '#f43f5e' }, // red → rose
    { from: '#6366f1', to: '#8b5cf6' }, // indigo → violet
    { from: '#84cc16', to: '#22c55e' }, // lime → green
    { from: '#0ea5e9', to: '#6366f1' }, // sky → indigo
    { from: '#f97316', to: '#facc15' }, // orange → yellow
    { from: '#14b8a6', to: '#06b6d4' }, // teal → cyan
]

export default function GanttChart({ gantt, processes }) {
    const colorMap = useMemo(() => {
        const map = {}
        processes.forEach((p, i) => {
            map[p.id] = PROCESS_GRADIENTS[i % PROCESS_GRADIENTS.length]
        })
        return map
    }, [processes])

    if (!gantt || gantt.length === 0) return null

    const totalTime = gantt[gantt.length - 1].end
    const minTime = gantt[0].start
    const span = totalTime - minTime || 1

    const pct = (t) => ((t - minTime) / span) * 100
    const timeLabels = [...new Set(gantt.flatMap(b => [b.start, b.end]))].sort((a, b) => a - b)

    return (
        <div className="space-y-3">
            {/* Gantt bar */}
            <div className="relative h-16 rounded-xl overflow-hidden
                dark:bg-white/5 dark:border dark:border-white/8
                bg-slate-100 border border-slate-200">
                {gantt.map((block, i) => {
                    const grad = colorMap[block.pid]
                    const left = pct(block.start)
                    const width = pct(block.end) - left
                    return (
                        <div
                            key={i}
                            className="gantt-bar absolute top-0 h-full group flex items-center justify-center"
                            style={{
                                left: `${left}%`,
                                width: `${Math.max(width, 0.5)}%`,
                                background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                                borderRight: '2px solid rgba(0,0,0,0.2)',
                                animationDelay: `${i * 40}ms`,
                            }}
                            title={`P${block.pid}: ${block.start} → ${block.end}`}
                        >
                            {width > 4 && (
                                <span className="text-white font-bold text-xs font-mono select-none drop-shadow-sm">
                                    P{block.pid}
                                </span>
                            )}
                            {/* Hover tooltip */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2
                                glass dark:bg-slate-900/90 bg-white text-xs rounded-xl
                                px-3 py-1.5 font-mono whitespace-nowrap
                                opacity-0 group-hover:opacity-100 transition-opacity duration-150
                                pointer-events-none z-20 shadow-xl
                                dark:text-white text-slate-800
                                border dark:border-white/10 border-slate-200">
                                P{block.pid}&nbsp;·&nbsp;{block.start}→{block.end}&nbsp;({block.end - block.start}ms)
                                {/* Arrow */}
                                <span className="absolute top-full left-1/2 -translate-x-1/2
                                    w-0 h-0 border-l-4 border-r-4 border-t-4
                                    border-l-transparent border-r-transparent
                                    dark:border-t-white/10 border-t-slate-200" />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Time labels */}
            <div className="relative h-5">
                {timeLabels.map((t, i) => {
                    const pos = pct(t)
                    return (
                        <span
                            key={i}
                            className="absolute -translate-x-1/2 text-[10px] font-mono dark:text-white/30 text-slate-400"
                            style={{ left: `${pos}%` }}
                        >
                            {t}
                        </span>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 pt-1">
                {processes.map(p => {
                    const grad = colorMap[p.id]
                    return (
                        <div key={p.id} className="flex items-center gap-1.5 text-xs font-mono">
                            <span
                                className="w-3 h-3 rounded-sm flex-shrink-0"
                                style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                            />
                            <span className="dark:text-white/40 text-slate-500">P{p.id}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
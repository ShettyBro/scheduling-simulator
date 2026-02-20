import React from 'react'

export default function ProcessTable({ processes, setProcesses, algorithm }) {
    const showPriority = algorithm === 'priority'

    const update = (index, field, value) => {
        const updated = [...processes]
        const parsed = value === '' ? '' : Number(value)
        updated[index] = { ...updated[index], [field]: parsed }
        setProcesses(updated)
    }

    const addRow = () => {
        const nextId = processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1
        setProcesses([...processes, { id: nextId, arrivalTime: 0, burstTime: 1, priority: 1 }])
    }

    const removeRow = (index) => {
        if (processes.length <= 1) return
        setProcesses(processes.filter((_, i) => i !== index))
    }

    const inputClass = `w-full text-center font-mono text-sm
        dark:bg-white/5 dark:border dark:border-white/10 dark:text-white dark:placeholder-white/20
        bg-white border border-slate-200 text-slate-800
        rounded-lg py-1.5 px-2
        focus:outline-none focus:ring-2 dark:focus:ring-cyan-500/40 focus:ring-cyan-400/60
        transition-all duration-150`

    return (
        <div className="space-y-3">
            <div className="overflow-x-auto scrollbar-thin rounded-xl
                dark:border dark:border-white/8
                border border-slate-200">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="dark:bg-white/5 bg-slate-50 dark:border-b dark:border-white/8 border-b border-slate-200">
                            <th className="py-3 px-4 text-left font-semibold dark:text-white/30 text-slate-400 text-[10px] uppercase tracking-widest w-20">
                                PID
                            </th>
                            <th className="py-3 px-4 font-semibold dark:text-white/30 text-slate-400 text-[10px] uppercase tracking-widest">
                                Arrival
                            </th>
                            <th className="py-3 px-4 font-semibold dark:text-white/30 text-slate-400 text-[10px] uppercase tracking-widest">
                                Burst
                            </th>
                            {showPriority && (
                                <th className="py-3 px-4 font-semibold dark:text-white/30 text-slate-400 text-[10px] uppercase tracking-widest">
                                    Priority
                                </th>
                            )}
                            <th className="py-3 px-4 w-14" />
                        </tr>
                    </thead>
                    <tbody className="dark:divide-y dark:divide-white/5 divide-y divide-slate-100">
                        {processes.map((p, i) => (
                            <tr key={p.id}
                                className="group dark:hover:bg-white/[0.03] hover:bg-slate-50 transition-colors duration-150">
                                <td className="py-2.5 px-4">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                        bg-gradient-to-br from-cyan-500 to-violet-600
                                        text-white font-mono font-bold text-xs shadow-md">
                                        P{p.id}
                                    </span>
                                </td>
                                <td className="py-2.5 px-4">
                                    <input
                                        type="number"
                                        min="0"
                                        value={p.arrivalTime}
                                        onChange={e => update(i, 'arrivalTime', e.target.value)}
                                        className={inputClass}
                                    />
                                </td>
                                <td className="py-2.5 px-4">
                                    <input
                                        type="number"
                                        min="1"
                                        value={p.burstTime}
                                        onChange={e => update(i, 'burstTime', e.target.value)}
                                        className={inputClass}
                                    />
                                </td>
                                {showPriority && (
                                    <td className="py-2.5 px-4">
                                        <input
                                            type="number"
                                            min="1"
                                            value={p.priority}
                                            onChange={e => update(i, 'priority', e.target.value)}
                                            className={inputClass}
                                        />
                                    </td>
                                )}
                                <td className="py-2.5 px-4 text-center">
                                    <button
                                        onClick={() => removeRow(i)}
                                        disabled={processes.length <= 1}
                                        className="w-7 h-7 rounded-lg
                                            dark:text-white/25 dark:hover:text-red-400 dark:hover:bg-red-500/10
                                            text-slate-300 hover:text-red-500 hover:bg-red-50
                                            disabled:opacity-20 disabled:cursor-not-allowed
                                            transition-all duration-150 flex items-center justify-center text-lg"
                                        title="Remove process"
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Process button */}
            <button
                onClick={addRow}
                className="group flex items-center gap-2 text-sm font-medium
                    dark:text-white/40 dark:hover:text-white
                    text-slate-400 hover:text-slate-700
                    transition-all duration-150"
            >
                <span className="w-6 h-6 rounded-full
                    bg-gradient-to-br from-cyan-500/20 to-violet-500/20
                    dark:border dark:border-white/10 border border-slate-200
                    flex items-center justify-center
                    dark:text-cyan-400 text-cyan-500
                    group-hover:from-cyan-500/40 group-hover:to-violet-500/40
                    font-bold text-base leading-none transition-all duration-150">
                    +
                </span>
                Add Process
            </button>
        </div>
    )
}
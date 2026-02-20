import React from 'react'

export default function ResultsTable({ results }) {
    if (!results || results.length === 0) return null

    const avgWT = results.reduce((s, r) => s + r.waitingTime, 0) / results.length
    const avgTAT = results.reduce((s, r) => s + r.turnaroundTime, 0) / results.length

    return (
        <div className="overflow-x-auto scrollbar-thin rounded-xl
            dark:border dark:border-white/8
            border border-slate-200">
            <table className="w-full text-sm">
                <thead>
                    <tr className="dark:bg-white/5 bg-slate-50 dark:border-b dark:border-white/8 border-b border-slate-200">
                        {['PID', 'Arrival', 'Burst', 'Priority', 'Waiting Time', 'Turnaround Time'].map(h => (
                            <th key={h}
                                className="py-3 px-4 font-bold dark:text-white/30 text-slate-500 text-[10px] uppercase tracking-widest text-center">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="dark:divide-y dark:divide-white/5 divide-y divide-slate-100">
                    {results.map((r) => (
                        <tr key={r.id}
                            className="dark:hover:bg-white/[0.03] hover:bg-slate-50 transition-colors duration-150">
                            <td className="py-3 px-4 text-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                    bg-gradient-to-br from-cyan-500 to-violet-600
                                    text-white font-mono font-bold text-xs shadow-md">
                                    P{r.id}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-sm dark:text-white/50 text-slate-800 font-medium">
                                {r.arrivalTime}
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-sm dark:text-white/50 text-slate-800 font-medium">
                                {r.burstTime}
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-sm dark:text-white/50 text-slate-800 font-medium">
                                {r.priority}
                            </td>
                            <td className="py-3 px-4 text-center">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold font-mono
                                    dark:bg-amber-500/15 dark:text-amber-300 dark:border dark:border-amber-500/20
                                    bg-amber-50 text-amber-700 border border-amber-100">
                                    {r.waitingTime}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold font-mono
                                    dark:bg-emerald-500/15 dark:text-emerald-300 dark:border dark:border-emerald-500/20
                                    bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    {r.turnaroundTime}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="dark:bg-white/5 dark:border-t dark:border-white/10 bg-slate-50 border-t-2 border-slate-200">
                        <td colSpan={4}
                            className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest dark:text-white/25 text-slate-500 text-right pr-6">
                            Averages
                        </td>
                        <td className="py-3 px-4 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold font-mono
                                dark:bg-amber-500/25 dark:text-amber-200 dark:border dark:border-amber-400/30
                                bg-amber-100 text-amber-800 border border-amber-200">
                                {avgWT.toFixed(2)}
                            </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold font-mono
                                dark:bg-emerald-500/25 dark:text-emerald-200 dark:border dark:border-emerald-400/30
                                bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {avgTAT.toFixed(2)}
                            </span>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
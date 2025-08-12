import React, { useMemo, useState } from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from 'recharts';

// CustomLineChart
// Props:
//  - data: [{ label: '2024-01', income: 1200, expenses: 300, net: 900 }, ...]
//  - height: number (px) default 240
//  - currency: string currency code for Intl.NumberFormat (default 'EUR')
//  - showSeries: { income: true, expenses: true, net: true } initial visibility

export default function CustomLineChart({
                                            data = [],
                                            height = 260,
                                            currency = 'EUR',
                                            showSeries: initialShowSeries = { income: true, expenses: true, net: true },
                                        }) {
    const [visible, setVisible] = useState(initialShowSeries);

    // memoize formatter
    const fmt = useMemo(() => {
        try {
            return new Intl.NumberFormat('pt-PT', { style: 'currency', currency });
        } catch (e) {
            return { format: (v) => String(v) };
        }
    }, [currency]);

    const toggle = (key) => {
        setVisible((v) => ({ ...v, [key]: !v[key] }));
    };

    const hasData = Array.isArray(data) && data.length > 0;

    // Recharts expects numbers — coerce and protect
    const prepared = useMemo(() => {
        if (!hasData) return [];
        return data.map((row) => ({
            label: row.label,
            income: Number(row.income ?? 0),
            expenses: Number(row.expenses ?? 0),
            net: Number(row.net ?? (Number(row.income ?? 0) - Number(row.expenses ?? 0))),
        }));
    }, [data, hasData]);

    const tooltipFormatter = (value) => fmt.format(Number(value ?? 0));

    const renderEmpty = () => (
        <div className="flex items-center justify-center h-full text-gray-400">
            Sem dados para mostrar
        </div>
    );

    // Simple legend UI (not the Recharts built-in clickable legend)
    const LegendControls = () => (
        <div className="flex gap-2 items-center">
            <button
                onClick={() => toggle('income')}
                className={`px-2 py-1 rounded text-sm border ${visible.income ? 'bg-white shadow' : 'bg-transparent'}`}
                aria-pressed={visible.income}
                title="Alternar Entradas"
            >
                Entrada
            </button>

            <button
                onClick={() => toggle('expenses')}
                className={`px-2 py-1 rounded text-sm border ${visible.expenses ? 'bg-white shadow' : 'bg-transparent'}`}
                aria-pressed={visible.expenses}
                title="Alternar Despesas"
            >
                Despesa
            </button>

            <button
                onClick={() => toggle('net')}
                className={`px-2 py-1 rounded text-sm border ${visible.net ? 'bg-white shadow' : 'bg-transparent'}`}
                aria-pressed={visible.net}
                title="Alternar Líquido"
            >
                Líquido
            </button>

            <button
                onClick={() => setVisible({ income: true, expenses: true, net: true })}
                className="px-2 py-1 rounded text-sm border"
                title="Mostrar todos"
            >
                Reset
            </button>
        </div>
    );

    return (
        <div className="w-full">
            <div className="flex justify-between items-start mb-3">
                <div className="text-sm text-gray-500">Períodos: {hasData ? `${data.length}` : '0'}</div>
                <LegendControls />
            </div>

            <div style={{ height }} className="w-full">
                {!hasData ? (
                    renderEmpty()
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={prepared} margin={{ top: 8, right: 20, bottom: 6, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(v) => fmt.format(v)} />
                            <Tooltip formatter={tooltipFormatter} />
                            <Legend />

                            {visible.income && (
                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    name="Entrada"
                                    stroke="#10B981" // Tailwind emerald-500
                                    strokeWidth={2}
                                    dot={{ r: 2 }}
                                    activeDot={{ r: 4 }}
                                />
                            )}

                            {visible.expenses && (
                                <Line
                                    type="monotone"
                                    dataKey="expenses"
                                    name="Despesa"
                                    stroke="#EF4444" // Tailwind red-500
                                    strokeWidth={2}
                                    dot={{ r: 2 }}
                                    activeDot={{ r: 4 }}
                                    strokeDasharray="5 5"
                                />
                            )}

                            {visible.net && (
                                <Line
                                    type="monotone"
                                    dataKey="net"
                                    name="Líquido"
                                    stroke="#3B82F6" // Tailwind blue-500
                                    strokeWidth={2}
                                    dot={{ r: 2 }}
                                    activeDot={{ r: 4 }}
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

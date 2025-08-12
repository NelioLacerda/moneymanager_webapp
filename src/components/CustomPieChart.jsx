import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
} from "recharts";

/**
 * CustomPieChart
 * - data: [{ name: string, amount: number }]
 * - colors: string[] (hex ou css colors)
 * - label: string (título do centro)
 * - totalAmount: string | number (valor central formatado)
 * - showTextAnchor: boolean (se true, mostra rótulos ancorados nos segmentos)
 * - height: number (altura do gráfico em px)
 * - innerRadius / outerRadius: números para controle do donut
 * - valueFormatter: (value, name) => string (formatação do tooltip)
 */
const CustomPieChart = ({
                            data = [],
                            colors = [],
                            label = "",
                            totalAmount = "",
                            showTextAnchor = false,
                            height = 260,
                            innerRadius = 70,
                            outerRadius = 100,
                            valueFormatter,
                        }) => {
    const defaultPalette = ["#4c1d95", "#dc2626", "#16a34a", "#0ea5e9", "#f59e0b", "#9333ea"];
    const palette = colors.length ? colors : defaultPalette;

    const chartData = Array.isArray(data)
        ? data.map((d) => ({ name: d?.name ?? "", amount: Number(d?.amount) || 0 }))
        : [];

    const total = chartData.reduce((sum, d) => sum + (d.amount || 0), 0);
    const isEmpty = total <= 0;

    const fmtNumber = (v) =>
        typeof v === "number" ? v.toLocaleString(undefined, { maximumFractionDigits: 2 }) : String(v);

    const tooltipFormatter = (value, name) => {
        if (typeof valueFormatter === "function") return [valueFormatter(value, name), name];
        return [fmtNumber(value), name];
    };

    const percentOf = (value) => (total > 0 ? (value / total) * 100 : 0);

    return (
        <div style={{ width: "100%", height }}>
            <div className="relative w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={isEmpty ? [{ name: "Sem dados", amount: 1 }] : chartData}
                            dataKey="amount"
                            nameKey="name"
                            innerRadius={innerRadius}
                            outerRadius={outerRadius}
                            paddingAngle={2}
                            cornerRadius={3}
                            isAnimationActive
                            stroke="#ffffff"
                            strokeWidth={1}
                            labelLine={showTextAnchor && !isEmpty}
                        >
                            {(isEmpty ? [{ name: "Sem dados", amount: 1 }] : chartData).map((entry, idx) => (
                                <Cell
                                    key={`cell-${idx}`}
                                    fill={isEmpty ? "#E5E7EB" : palette[idx % palette.length]}
                                />
                            ))}

                            {showTextAnchor && !isEmpty && (
                                <LabelList
                                    dataKey="amount"
                                    position="outside"
                                    formatter={(value, entry) => {
                                        const pct = percentOf(value);
                                        // Mostra rótulo somente para fatias com pelo menos 3% para evitar poluição visual
                                        return pct >= 3 ? `${entry.name} (${pct.toFixed(0)}%)` : "";
                                    }}
                                />
                            )}
                        </Pie>

                        {!isEmpty && (
                            <Tooltip
                                formatter={tooltipFormatter}
                                wrapperStyle={{ outline: "none" }}
                            />
                        )}
                        {!isEmpty && (
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                iconSize={8}
                            />
                        )}
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    {label ? <span className="text-xs text-gray-500">{label}</span> : null}
                    <span className="text-lg font-semibold">{String(totalAmount ?? "")}</span>
                </div>
            </div>
        </div>
    );
};

export default CustomPieChart;
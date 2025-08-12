import React from "react";
import PropTypes from "prop-types";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";

const CustomPieChart = ({
                            data = [],
                            label = "",
                            totalAmount = "",
                            colors = ["#8884d8", "#82ca9d", "#ffc658"],
                            showTextAnchor = false,
                            currency = "EUR",
                        }) => {
    const formattedCurrency = (value) => {
        if (value == null || Number.isNaN(Number(value))) return "-";
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
        }).format(value);
    };

    const toNumberLike = (v) => {
        if (v === null || v === undefined || v === "") return NaN;
        if (typeof v === "number") return v;
        if (typeof v === "string") {
            const s = v.trim();
            let normalized = s.replace(/[^\d.,\-]/g, "");
            const hasComma = normalized.includes(",");
            const hasDot = normalized.includes(".");
            if (hasComma && hasDot) {
                const lastComma = normalized.lastIndexOf(",");
                const lastDot = normalized.lastIndexOf(".");
                const decSep = lastComma > lastDot ? "," : ".";
                const thouSep = decSep === "," ? "." : ",";
                normalized = normalized.split(thouSep).join("");
                if (decSep === ",") normalized = normalized.replace(",", ".");
            } else if (hasComma && !hasDot) {
                normalized = normalized.replace(/\./g, "");
                normalized = normalized.replace(",", ".");
            } else {
                normalized = normalized.replace(/,/g, "");
            }
            const n = Number(normalized);
            return Number.isNaN(n) ? NaN : n;
        }
        return NaN;
    };

    const total = data.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    const providedTotalNum = toNumberLike(totalAmount);
    const displayTotal = Number.isFinite(providedTotalNum)
        ? formattedCurrency(providedTotalNum)
        : formattedCurrency(total);

    return (
        <div className="w-full card">
            <div className="w-full h-64 relative flex flex-col items-center">
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="amount"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={4}
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`slice-${index}`}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value) => formattedCurrency(value)}
                            cursor={false}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span
                        className={`text-sm text-gray-500 ${showTextAnchor ? "" : ""}`}
                        aria-hidden={!showTextAnchor}
                    >
                        {label}
                    </span>
                    <span className="text-2xl font-semibold mt-1">{displayTotal}</span>
                </div>

                {/* legend / small summary under chart */}
                <div className="mt-4 w-full flex justify-center gap-6 px-4">
                    {data.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: colors[i % colors.length] }}
                            />
                            <div className="text-left">
                                <div className="text-xs text-gray-500">{d.name}</div>
                                <div className="text-sm font-medium">
                                    {formattedCurrency(d.amount)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

CustomPieChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({ name: PropTypes.string, amount: PropTypes.number })
    ),
    label: PropTypes.string,
    totalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    colors: PropTypes.arrayOf(PropTypes.string),
    showTextAnchor: PropTypes.bool,
    currency: PropTypes.string,
};

export default CustomPieChart;
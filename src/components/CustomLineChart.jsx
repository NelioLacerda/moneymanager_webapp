import React, { useRef, useEffect, useState } from "react";

function catmullRom2bezier(points, minY, maxY) {
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const d = [];
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = i === 0 ? points[i] : points[i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = i + 2 < points.length ? points[i + 2] : p2;

        const bp1x = p1.x + (p2.x - p0.x) / 6;
        const bp1y = p1.y + (p2.y - p0.y) / 6;

        const bp2x = p2.x - (p3.x - p1.x) / 6;
        const bp2y = p2.y - (p3.y - p1.y) / 6;

        // CLAMP Y to prevent overshoot outside chart bounds
        const cbp1y = clamp(bp1y, minY, maxY);
        const cbp2y = clamp(bp2y, minY, maxY);

        d.push({
            bp1x,
            bp1y: cbp1y,
            bp2x,
            bp2y: cbp2y,
            x: p2.x,
            y: p2.y,
            moveTo: i === 0 ? points[0] : undefined,
        });
    }
    return d;
}

export default function CustomLineChart({ data = [], height = 240 }) {
    const wrapperRef = useRef(null);
    const [width, setWidth] = useState(600);
    const [hover, setHover] = useState(null);

    useEffect(() => {
        if (!wrapperRef.current) return;
        const ro = new ResizeObserver(() => {
            setWidth(wrapperRef.current.clientWidth || 600);
        });
        ro.observe(wrapperRef.current);
        setWidth(wrapperRef.current.clientWidth || 600);
        return () => ro.disconnect();
    }, []);

    if (!data || data.length === 0) {
        return (
            <div ref={wrapperRef} className="w-full" style={{ height }}>
                <div className="flex items-center justify-center h-full text-gray-400">No data</div>
            </div>
        );
    }

    // padding interno do SVG
    const padding = { top: 18, right: 20, bottom: 36, left: 28 };
    const innerW = Math.max(10, width - padding.left - padding.right);
    const innerH = Math.max(10, height - padding.top - padding.bottom);

    const values = data.map((d) => Number(d.value || 0));
    const max = Math.max(...values) || 1;
    const min = Math.min(...values);

    const xStep = innerW / Math.max(1, data.length - 1);

    const points = data.map((d, i) => {
        const x = padding.left + i * xStep;
        const y = padding.top + innerH - ((Number(d.value || 0) - min) / (max - min || 1)) * innerH;
        // Ensure point y is inside bounds (safety clamp)
        const clampY = Math.max(padding.top, Math.min(padding.top + innerH, y));
        return { x, y: clampY, raw: d };
    });

    // build smooth path using catmullRom->bezier with clamp bounds
    let pathD = "";
    if (points.length === 1) {
        pathD = `M ${points[0].x} ${points[0].y}`;
    } else {
        const minY = padding.top;
        const maxY = padding.top + innerH;
        const beziers = catmullRom2bezier(points, minY, maxY);
        pathD = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < beziers.length; i++) {
            const b = beziers[i];
            pathD += ` C ${b.bp1x} ${b.bp1y}, ${b.bp2x} ${b.bp2y}, ${b.x} ${b.y}`;
        }
    }

    // area path (closing to bottom)
    const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + innerH} L ${points[0].x} ${padding.top + innerH} Z`;

    // tooltip logic: find nearest point by x
    function handleMouseMove(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        let nearest = 0;
        let bestDist = Infinity;
        points.forEach((p, i) => {
            const d = Math.abs(p.x - mx);
            if (d < bestDist) {
                bestDist = d;
                nearest = i;
            }
        });
        setHover({ index: nearest, point: points[nearest] });
    }

    function handleLeave() {
        setHover(null);
    }

    // small y-axis ticks labels (3 ticks)
    const ticks = [max, (max + min) / 2, min];

    // decide quantas labels X desenhar
    const approxLabelWidth = 80;
    const maxLabels = Math.max(2, Math.floor(width / approxLabelWidth));
    const step = Math.max(1, Math.ceil(data.length / maxLabels));

    return (
        <div className="w-full" ref={wrapperRef} style={{ height }}>
            <div className="relative rounded-xl bg-white/0 p-3">
                <svg width={width} height={height} onMouseMove={handleMouseMove} onMouseLeave={handleLeave}>
                    <defs>
                        <linearGradient id="gArea" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.03" />
                        </linearGradient>
                        <linearGradient id="gLine" x1="0" x2="1">
                            <stop offset="0%" stopColor="#7c3aed" />
                            <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#7c3aed" floodOpacity="0.08" />
                        </filter>
                    </defs>

                    {/* horizontal guide lines */}
                    {ticks.map((t, i) => {
                        const yy = padding.top + (i / (ticks.length - 1)) * innerH;
                        return (
                            <line key={i} x1={padding.left} x2={padding.left + innerW} y1={yy} y2={yy} stroke="#f3f4f6" strokeWidth={1} />
                        );
                    })}

                    {/* area */}
                    <path d={areaD} fill="url(#gArea)" stroke="none" />

                    {/* line with shadow */}
                    <g filter="url(#shadow)">
                        <path d={pathD} fill="none" stroke="url(#gLine)" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                    </g>

                    {/* markers */}
                    {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 || i === 0 ? 3.6 : 3} fill="#7c3aed" stroke="#fff" strokeWidth={1.2} />
                    ))}

                    {/* x labels */}
                    {points.map((p, i) => {
                        if (i % step !== 0 && i !== points.length - 1) return null;
                        const rotate = step === 1 && data.length > maxLabels ? -30 : 0;
                        const tx = p.x;
                        const ty = padding.top + innerH + 20;
                        return (
                            <text
                                key={i}
                                x={tx}
                                y={ty}
                                textAnchor="middle"
                                fontSize={12}
                                fill="#9ca3af"
                                transform={rotate ? `rotate(${rotate} ${tx} ${ty})` : undefined}
                            >
                                {data[i].label}
                            </text>
                        );
                    })}

                    {/* hover line + active dot */}
                    {hover && (
                        <g>
                            <line x1={hover.point.x} x2={hover.point.x} y1={padding.top} y2={padding.top + innerH} stroke="#c7b0ff" strokeWidth={1} strokeDasharray="3 4" />
                            <circle cx={hover.point.x} cy={hover.point.y} r={5.2} fill="#7c3aed" stroke="#fff" strokeWidth={2} />
                        </g>
                    )}
                </svg>

                {/* Tooltip */}
                {hover && (
                    <div
                        className="absolute top-0 left-0 pointer-events-none"
                        style={{ transform: `translate(${Math.min(Math.max(hover.point.x - 120, 6), width - 240)}px, ${hover.point.y - 90}px)` }}
                    >
                        <div className="bg-white shadow-lg rounded-lg border p-3 text-sm w-40">
                            <div className="text-gray-500 text-xs">{data[hover.index].label}</div>
                            <div className="mt-1 font-semibold text-violet-700">Total: {data[hover.index].details?.Total ?? `₹${data[hover.index].value}`}</div>
                            {data[hover.index].details && (
                                <div className="text-xs text-gray-500 mt-1">
                                    {Object.entries(data[hover.index].details).map(([k, v]) => (
                                        <div key={k} className="flex justify-between">
                                            <div>{k}</div>
                                            <div className="font-medium">{v}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
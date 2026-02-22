"use client";

import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList
} from 'recharts';
import {
    getPalSriSedanaData,
    getLabelRezeki,
    getCurrentPeriodAnalysis
} from '@/lib/pal-sri-sedana';

interface PalSriSedanaChartProps {
    totalUrip: number;
    birthDate: Date;
}

export default function PalSriSedanaChart({ totalUrip, birthDate }: PalSriSedanaChartProps) {
    // Get Pal Sri Sedana data for this Urip
    const palData = useMemo(() => getPalSriSedanaData(totalUrip), [totalUrip]);

    // Total periods to display: 0-108 tahun = 18 periods of 6 years
    const TOTAL_PERIODS = 18;

    // Transform data for chart using Pure Modulo cycling
    const chartData = useMemo(() => {
        if (!palData) return [];
        const siklusLength = palData.siklus.length;

        return Array.from({ length: TOTAL_PERIODS }, (_, index) => {
            const value = palData.siklus[index % siklusLength];
            return {
                age: index * 6,
                ageRange: `${index * 6}-${(index + 1) * 6}`,
                value: value === 0 ? 0.3 : value,
                rawValue: value,
                color: getLabelRezeki(value).color,
            };
        });
    }, [palData]);

    // Get current period analysis
    const analysis = useMemo(() => {
        if (!palData) return null;
        return getCurrentPeriodAnalysis(birthDate, palData);
    }, [birthDate, palData]);

    if (!palData) {
        return (
            <div className="bg-white rounded-4xl p-8 border border-stone-200 shadow-lg">
                <p className="text-stone-500 text-center">
                    Data Pal Sri Sedana tidak tersedia untuk Urip {totalUrip}.
                </p>
            </div>
        );
    }

    const currentLabel = analysis ? getLabelRezeki(analysis.value) : null;

    return (
        <div className="space-y-8">
            {/* Chart Section */}
            <div className="bg-white rounded-4xl p-8 border border-stone-200 shadow-lg">
                <div className="mb-6">
                    <h3 className="font-display text-2xl font-bold text-stone-900 mb-2">
                        Grafik Nasib <span className="text-primary">Pal Sri Sedana</span>
                    </h3>
                    <p className="text-stone-600 text-sm">
                        Visualisasi siklus rezeki dalam periode 6 tahunan (0–108 tahun)
                    </p>
                </div>

                <div className="h-[420px] w-full mb-4 overflow-x-auto">
                    <div className="min-w-[700px] h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 20, left: 0, bottom: 25 }}
                                barCategoryGap="2%"
                                barGap={0}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />

                                <XAxis
                                    dataKey="ageRange"
                                    stroke="#6B7280"
                                    interval={0}
                                    tick={({ x, y, payload, index }: any) => {
                                        const startAge = index * 6;
                                        const isLast = index === chartData.length - 1;
                                        return (
                                            <g>
                                                <text x={x - (payload.offset || 0)} y={y + 16} textAnchor="middle" fill="#6B7280" fontSize={8} fontWeight="bold">
                                                    {startAge}
                                                </text>
                                                {isLast && (
                                                    <text x={x + (payload.offset || 0)} y={y + 16} textAnchor="middle" fill="#6B7280" fontSize={8} fontWeight="bold">
                                                        {(index + 1) * 6}
                                                    </text>
                                                )}
                                            </g>
                                        );
                                    }}
                                    label={{ value: 'Usia (Tahun)', position: 'insideBottom', offset: -12, fill: '#6B7280', fontSize: 11 }}
                                    padding={{ left: 0, right: 0 }}
                                />

                                <YAxis
                                    domain={[0, 8]}
                                    ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                                    stroke="#6B7280"
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    label={{ value: 'Nilai Rezeki', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
                                />

                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.04)', radius: 6 }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            const label = getLabelRezeki(data.rawValue);

                                            return (
                                                <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xl max-w-[220px]">
                                                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                                                        Usia {data.ageRange} Tahun
                                                    </p>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div
                                                            className="w-3 h-3 rounded-full shrink-0"
                                                            style={{ backgroundColor: label.color }}
                                                        />
                                                        <p className="font-bold text-stone-900 text-sm">
                                                            {label.label}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                                                        {label.desc}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />

                                <Bar
                                    dataKey="value"
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={1500}
                                >
                                    <LabelList
                                        dataKey="rawValue"
                                        position="top"
                                        fill="#374151"
                                        fontSize={11}
                                        fontWeight="bold"
                                        offset={5}
                                        content={({ x, y, width, value }: any) => (
                                            <text
                                                x={x + width / 2}
                                                y={y - 5}
                                                textAnchor="middle"
                                                fill="#374151"
                                                fontSize={11}
                                                fontWeight="bold"
                                            >
                                                {value}
                                            </text>
                                        )}
                                    />
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-stone-100">
                    <p className="text-xs text-stone-400 italic text-center">
                        Berdasarkan Lontar Pal Sri Sedana
                    </p>
                </div>
            </div>

            {/* Current Period Analysis */}
            {analysis && currentLabel && (
                <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-4xl p-8 border border-primary/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-4 h-4 rounded-full animate-pulse"
                            style={{ backgroundColor: currentLabel.color }}
                        />
                        <h4 className="font-display text-xl font-bold text-stone-900">
                            Analisis Periode Saat Ini
                        </h4>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/80 rounded-2xl p-4 border border-stone-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs uppercase tracking-widest font-bold text-stone-500">
                                    Usia Anda Sekarang
                                </span>
                                <span className="text-2xl font-display font-bold text-primary">
                                    {analysis.currentAge} Tahun
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs uppercase tracking-widest font-bold text-stone-500">
                                    Periode
                                </span>
                                <span className="text-lg font-semibold text-stone-700">
                                    {analysis.periodIndex * 6}-{(analysis.periodIndex + 1) * 6} Tahun
                                </span>
                            </div>
                        </div>

                        <div className="bg-white/80 rounded-2xl p-5 border border-stone-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                    style={{ backgroundColor: currentLabel.color }}
                                >
                                    {analysis.value}
                                </div>
                                <span className="font-bold text-lg" style={{ color: currentLabel.color }}>
                                    {currentLabel.label}
                                </span>
                            </div>
                            <p className="text-stone-800 leading-relaxed font-medium mb-3">
                                {currentLabel.desc}
                            </p>
                            <div className="pt-3 border-t border-stone-200/50">
                                <p className="text-stone-600 text-sm leading-relaxed italic">
                                    {analysis.interpretation}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

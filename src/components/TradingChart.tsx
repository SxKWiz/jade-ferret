import { createChart, IChartApi, CandlestickData, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export type ChartData = CandlestickData;

export const TradingChart = ({ data }: { data: ChartData[] }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<IChartApi | null>(null); // Ref to store the chart instance

    useEffect(() => {
        if (!chartContainerRef.current || data.length === 0) {
            return;
        }

        // If a chart instance already exists, remove it before creating a new one
        if (chartInstanceRef.current) {
            chartInstanceRef.current.remove();
            chartInstanceRef.current = null;
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'hsl(var(--foreground))',
            },
            grid: {
                vertLines: { color: 'hsl(var(--border))' },
                horzLines: { color: 'hsl(var(--border))' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
        });

        // Store the new chart instance
        chartInstanceRef.current = chart;

        // Add candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderDownColor: '#ef5350',
            borderUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            wickUpColor: '#26a69a',
        });

        candlestickSeries.setData(data);
        chart.timeScale().fitContent();

        const handleResize = () => {
            if (chartInstanceRef.current && chartContainerRef.current) {
                chartInstanceRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function to remove the chart and event listener
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstanceRef.current) {
                chartInstanceRef.current.remove();
                chartInstanceRef.current = null;
            }
        };
    }, [data]); // Re-create the chart whenever the data changes

    return <div ref={chartContainerRef} className="w-full h-[500px]" />;
};

export default TradingChart;
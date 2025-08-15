import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export type ChartData = CandlestickData & { time: string };

export const TradingChart = ({ data }: { data: ChartData[] }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<{ chart: IChartApi, series: ISeriesApi<'Candlestick'> } | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Initialize chart only once
        if (!chartRef.current) {
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

            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderDownColor: '#ef5350',
                borderUpColor: '#26a69a',
                wickDownColor: '#ef5350',
                wickUpColor: '#26a69a',
            });

            chartRef.current = { chart, series: candlestickSeries };
        }

        const { chart, series } = chartRef.current;

        if (data.length > 0) {
            series.setData(data);
            chart.timeScale().fitContent();
        }

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [data]);

    // Cleanup chart on component unmount
    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.chart.remove();
                chartRef.current = null;
            }
        };
    }, []);

    return <div ref={chartContainerRef} className="w-full h-[500px]" />;
};

export default TradingChart;
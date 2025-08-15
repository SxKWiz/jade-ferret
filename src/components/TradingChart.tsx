import { createChart, ColorType, CandlestickSeries, type CandlestickData } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

export type ChartData = CandlestickData;

export const TradingChart = ({ data }: { data: ChartData[] }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<ReturnType<typeof createChart> | null>(null); // Ref to store the chart instance

    useEffect(() => {
        if (!chartContainerRef.current) {
            return;
        }

        // If a chart instance already exists, remove it before creating a new one
        if (chartInstanceRef.current) {
            chartInstanceRef.current.remove();
            chartInstanceRef.current = null;
        }

        // Validate and prepare data
        const validData = data
            .filter((item) => 
                item && 
                typeof item.time === 'number' && 
                typeof item.open === 'number' && 
                typeof item.high === 'number' && 
                typeof item.low === 'number' && 
                typeof item.close === 'number' &&
                !isNaN(item.time) &&
                !isNaN(item.open) &&
                !isNaN(item.high) &&
                !isNaN(item.low) &&
                !isNaN(item.close)
            )
            // Remove duplicates by time
            .filter((value, index, self) =>
                index === self.findIndex((t) => t.time === value.time)
            )
            // Sort by time in ascending order
            .sort((a, b) => a.time - b.time);

        // Don't create chart if no valid data
        if (validData.length === 0) {
            return;
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

        // Add candlestick series using the correct v5 API
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderDownColor: '#ef5350',
            borderUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            wickUpColor: '#26a69a',
        });

        candlestickSeries.setData(validData);
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

    return (
        <div ref={chartContainerRef} className="w-full h-[500px]">
            {data.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    No chart data available
                </div>
            )}
        </div>
    );
};

export default TradingChart;
import React, { useEffect, useState } from 'react';
import TradingChart, { ChartData } from '@/components/TradingChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';
import AnalysisPanel from '@/components/AnalysisPanel';

const Home = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loadingChart, setLoadingChart] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                // Fetching 1-day interval data for BTC/USDT from Binance
                const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=150');
                if (!response.ok) {
                    throw new Error('Failed to fetch data from Binance');
                }
                const data = await response.json();

                const formattedData: ChartData[] = data.map((d: any) => ({
                    time: d[0] / 1000, // lightweight-charts expects UTC timestamp in seconds
                    open: parseFloat(d[1]),
                    high: parseFloat(d[2]),
                    low: parseFloat(d[3]),
                    close: parseFloat(d[4]),
                }));
                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
                showError("Could not load chart data. Please try again later.");
            } finally {
                setLoadingChart(false);
            }
        };

        fetchChartData();
    }, []);

    return (
        <div className="flex flex-1 flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>BTC/USDT Chart</CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingChart ? (
                        <Skeleton className="h-[500px] w-full" />
                    ) : (
                        <TradingChart data={chartData} />
                    )}
                </CardContent>
            </Card>
            <AnalysisPanel />
        </div>
    );
};

export default Home;
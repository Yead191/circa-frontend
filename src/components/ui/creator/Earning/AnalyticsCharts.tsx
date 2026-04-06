'use client'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { Star, MessageSquare, ShoppingBag } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../select';
import { useRouter, useSearchParams } from 'next/navigation';



const ChartCard = ({ title, icon, iconBg, iconColor, barColor, data, paramKey }: any) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentType = searchParams.get(paramKey) || 'month';

    const handleTypeChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(paramKey, value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    // Map API data to chart format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = data?.map((item: any) => ({
        day: item.date,
        value: item.total
    })) || [];

    // Calculate max value for Y-axis scaling
    const maxVal = Math.max(...chartData.map((d: any) => d.value), 10);
    const yAxisMax = Math.ceil(maxVal / 10) * 10;

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Icon Header */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
                        <div style={{ color: iconColor }}>{icon}</div>
                    </div>
                    <span>{title}</span>
                </div>

                <Select value={currentType} onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent className='bg-black'>
                        <SelectGroup>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>


            {/* Chart Container */}
            <div className="bg-[#121218] border border-gray-800 rounded-2xl p-4 md:p-6 shadow-xl overflow-hidden">
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                            barGap={8}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#2d2d3d"
                            />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                domain={[0, yAxisMax]}
                                allowDecimals={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{
                                    backgroundColor: '#1f1f29',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                                itemStyle={{ color: barColor }}
                            />
                            <Bar
                                dataKey="value"
                                radius={[4, 4, 0, 0]}
                                barSize={24}
                            >
                                {chartData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={barColor} fillOpacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex justify-center items-center gap-2 mt-4">
                    <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: barColor }}
                    ></div>
                    <span className="text-gray-400 text-xs font-medium">Earnings</span>
                </div>
            </div>
        </div>
    );
};

interface AnalyticsChartsProps {
    tierData: any[];
    messageData: any[];
    shopData: any[];
}

const AnalyticsCharts = ({ tierData, messageData, shopData }: AnalyticsChartsProps) => {


    return (
        <div>
            <div className=" w-full mt-10">
                {/* Responsive Grid: 1 column on mobile, 3 columns on large screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Chart 1: Orange/Gold */}
                    <ChartCard
                        title={"Tier"}
                        paramKey="tier_type"
                        data={tierData}
                        icon={<Star size={20} fill="currentColor" />}
                        iconBg="bg-orange-500/10"
                        iconColor="#d97706"
                        barColor="#c2844a"
                    />

                    {/* Chart 2: Blue */}
                    <ChartCard
                        title={"Message"}
                        paramKey="message_type"
                        data={messageData}
                        icon={<MessageSquare size={20} fill="currentColor" />}
                        iconBg="bg-blue-500/10"
                        iconColor="#3b82f6"
                        barColor="#4a82c2"
                    />

                    {/* Chart 3: Red/Pink */}
                    <ChartCard
                        title={"Shop"}
                        paramKey="shop_type"
                        data={shopData}
                        icon={<ShoppingBag size={20} fill="currentColor" />}
                        iconBg="bg-red-500/10"
                        iconColor="#ef4444"
                        barColor="#c27367"
                    />

                </div>
            </div>
        </div>
    )
}

export default AnalyticsCharts

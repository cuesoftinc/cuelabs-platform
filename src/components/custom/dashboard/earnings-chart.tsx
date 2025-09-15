'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { useEarnings } from '@/hooks/queries/useEarnings';
import { useAllBounties } from '@/hooks/queries/useAdmin';
import { Earning } from '@/types/earnings';
import { Bounty } from '@/types/bounties';
import CustomSpinner from '@/components/custom/custom-spinner';

// Mock data structure for earnings
interface ChartDataPoint {
  day: string;
  amount: number;
  date: string;
}


// Process real earnings data into chart format
const processEarningsData = (earnings: Earning[], bounties: Bounty[]): ChartDataPoint[] => {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  // Create a map of bounty IDs to bounty data for quick lookup
  const bountyMap = new Map<string, Bounty>();
  bounties.forEach(bounty => {
    bountyMap.set(bounty.id, bounty);
  });
  
  // Group earnings by date
  const earningsByDate: { [key: string]: number } = {};
  
  earnings.forEach(earning => {
    // Use createdTime from the top level of the earning record
    const date = new Date(earning.createdTime || '');
    if (date >= weekAgo && date <= today) {
      const dateKey = date.toISOString().split('T')[0];
      
      // Get the bounty reward amount from the linked bounty
      const bountyId = earning.fields.Bounty[0]; // Get first bounty ID
      const bounty = bountyMap.get(bountyId);
      const amount = bounty?.fields.Reward || 0;
      
      earningsByDate[dateKey] = (earningsByDate[dateKey] || 0) + amount;
    }
  });
  
  // Fill in missing days with 0
  const result: ChartDataPoint[] = [];
  const dayNames = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    
    result.push({
      day: dayNames[6 - i],
      amount: earningsByDate[dateKey] || 0,
      date: dateKey
    });
  }
  
  return result;
};

// Custom dot component for data points
const CustomDot = (props: { cx?: number; cy?: number; [key: string]: unknown }) => {
  const { cx, cy } = props;
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r="4"
      fill="white"
      stroke="url(#gradient)"
      strokeWidth="2"
    />
  );
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 shadow-lg">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-blue-400 text-sm">
          Earnings: €{payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function EarningsChart() {
  const { data: earnings, isLoading: isLoadingEarnings } = useEarnings();
  const { data: bounties, isLoading: isLoadingBounties } = useAllBounties();
  
  const isLoading = isLoadingEarnings || isLoadingBounties;
  
  // Use real data if available, otherwise show empty state
  const chartData = useMemo(() => {
    if (earnings && earnings.length > 0 && bounties && bounties.length > 0) {
      return processEarningsData(earnings, bounties as Bounty[]);
    }
    return []; // Empty array for empty state
  }, [earnings, bounties]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <CustomSpinner />
      </div>
    );
  }

  // Empty state when no earnings data
  if (chartData.length === 0 || chartData.every(point => point.amount === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center p-8">
        <div className="bg-[#2A2A2A] rounded-full p-4 mb-4">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Earnings Yet</h3>
        <p className="text-gray-400 text-sm mb-4 max-w-xs">
          Complete bounties to start earning rewards and see your progress here.
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Earnings will appear once you complete bounties</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      {/* Gradient definition for the line */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#2A2A2A" 
            strokeWidth={1}
          />
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickMargin={15}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickMargin={10}
            domain={[0, 'dataMax + 50']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="url(#gradient)"
            strokeWidth={2}
            dot={(props) => {
              const { key, ...otherProps } = props;
              return <CustomDot key={key} {...otherProps} />;
            }}
            activeDot={{ r: 6, fill: 'white', stroke: 'url(#gradient)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

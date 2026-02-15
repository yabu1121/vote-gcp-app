
"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type AnalyticsData = {
  daily: { date: string; votes: number }[];
  total: number;
  today: number;
  week: number;
  month: number;
};

export default function DashboardChart() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics/mine");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="h-64 flex items-center justify-center text-gray-400 font-bold">読み込み中...</div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 p-4 rounded-xl border-2 border-red-100 flex flex-col items-center">
          <span className="text-xs font-bold text-red-400">今日の投票</span>
          <span className="text-3xl font-black text-red-600">{data.today}</span>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-100 flex flex-col items-center">
          <span className="text-xs font-bold text-yellow-600">今週の投票</span>
          <span className="text-3xl font-black text-yellow-600">{data.week}</span>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100 flex flex-col items-center">
          <span className="text-xs font-bold text-blue-400">今月の投票</span>
          <span className="text-3xl font-black text-blue-600">{data.month}</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-100 flex flex-col items-center">
          <span className="text-xs font-bold text-gray-400">これまでの総数</span>
          <span className="text-3xl font-black text-gray-600">{data.total}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 bg-white p-4 rounded-xl border-2 border-dashed border-gray-200">
        <h3 className="text-sm font-bold text-gray-500 mb-4 text-center">過去7日間の投票推移</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.daily}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fontWeight: 'bold', fill: '#9CA3AF' }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: '#FEF2F2' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="votes" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

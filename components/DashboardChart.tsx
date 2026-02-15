
"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const DashboardChart = () => {
  const [data, setData] = useState<{ name: string; total: number }[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/analytics/mine");
        if (res.ok) {
          const json = await res.json();
          setData(json.dailyStats || []);
          setTotalVotes(json.totalVotes || 0);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="animate-pulse h-64 bg-base-secondary/30 rounded-3xl flex items-center justify-center font-bold text-middle-gray">Loading Chart...</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-conversation p-6 rounded-3xl border-2 border-white shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-xs font-black text-main uppercase tracking-widest mb-2">Total Votes</h4>
          <p className="text-4xl font-black text-dark-gray">{totalVotes}</p>
        </div>
        <div className="bg-accent/10 p-6 rounded-3xl border-2 border-white shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-xs font-black text-yellow-600 uppercase tracking-widest mb-2">Trend</h4>
          <p className="text-4xl font-black text-dark-gray flex items-center gap-2">
            <span className="text-green-500 text-2xl">▲</span>
            12%
          </p>
          <span className="text-[10px] font-bold text-middle-gray">vs last week</span>
        </div>
        <div className="bg-purple-50 p-6 rounded-3xl border-2 border-white shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-xs font-black text-purple-500 uppercase tracking-widest mb-2">Active Polls</h4>
          <p className="text-4xl font-black text-dark-gray">3</p>
        </div>
      </div>

      <div className="h-80 w-full bg-white rounded-3xl p-4 shadow-inner border border-base-secondary/50">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 'bold' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 'bold' }}
            />
            <Tooltip
              cursor={{ fill: '#F1F5F9', radius: 8 }}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', color: '#1E293B' }}
            />
            <Bar
              dataKey="total"
              fill="#5465FF"
              radius={[6, 6, 6, 6]}
              barSize={40}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardChart;

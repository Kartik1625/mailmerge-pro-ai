
import React from 'react';
import { EmailRecord } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StepReportProps {
  results: EmailRecord[];
  onReset: () => void;
}

export const StepReport: React.FC<StepReportProps> = ({ results, onReset }) => {
  const sentCount = results.filter(r => r.status === 'sent').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  const pieData = [
    { name: 'Delivered', value: sentCount },
    { name: 'Bounced', value: failedCount },
  ];

  const COLORS = ['#0891b2', '#f43f5e']; // Cyan 600, Rose 500

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Campaign Report</h2>
          <p className="text-zinc-500">Your emails have been processed successfully.</p>
        </div>
        <button
          onClick={onReset}
          className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
        >
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-4xl font-black text-zinc-900">{sentCount}</div>
          <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mt-1">Successfully Sent</div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-4xl font-black text-zinc-900">{failedCount}</div>
          <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mt-1">Failed / Bounced</div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="text-4xl font-black text-zinc-900">{Math.round((sentCount / results.length) * 100)}%</div>
          <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mt-1">Efficiency Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
          <h3 className="font-bold text-zinc-900 mb-6 uppercase text-xs tracking-widest">Delivery Status Distribution</h3>
          <div className="h-[250px] w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height={250} minWidth={1}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
          <h3 className="font-bold text-zinc-900 mb-6 uppercase text-xs tracking-widest">Campaign Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-zinc-50">
              <span className="text-zinc-500">Total Recipients</span>
              <span className="font-bold text-zinc-900">{results.length}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-zinc-50">
              <span className="text-zinc-500">Processing Time</span>
              <span className="font-bold text-zinc-900">~{Math.ceil(results.length * 0.6)} seconds</span>
            </div>
            <div className="flex justify-between py-3 border-b border-zinc-50">
              <span className="text-zinc-500">Sender Profile</span>
              <span className="font-bold text-violet-600">Enterprise Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

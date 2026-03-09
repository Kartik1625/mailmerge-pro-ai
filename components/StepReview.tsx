
import React, { useState } from 'react';
import { EmailRecord } from '../types';

interface StepReviewProps {
  data: EmailRecord[];
  onUpdate: (updated: EmailRecord[]) => void;
  onConfirm: () => void;
  isAnalyzing: boolean;
}

export const StepReview: React.FC<StepReviewProps> = ({ data, onUpdate, onConfirm, isAnalyzing }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    onUpdate(data.filter(item => item.id !== id));
  };

  const handleEditChange = (id: string, field: keyof EmailRecord, value: string) => {
    onUpdate(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Review Recipient List</h2>
          <p className="text-zinc-500">Double-check the details below before launching the campaign.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="px-8 py-3 bg-violet-600 text-white rounded-xl font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send All ({data.length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Recipient</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Subject</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Message Preview</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">AI Insight</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-violet-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    {editingId === row.id ? (
                      <input
                        type="email"
                        value={row.recipient}
                        onChange={(e) => handleEditChange(row.id, 'recipient', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-100"
                      />
                    ) : (
                      <span className="text-zinc-700 font-medium">{row.recipient}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === row.id ? (
                      <input
                        type="text"
                        value={row.subject}
                        onChange={(e) => handleEditChange(row.id, 'subject', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-100"
                      />
                    ) : (
                      <span className="text-zinc-600">{row.subject}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">
                    {editingId === row.id ? (
                      <textarea
                        value={row.message}
                        onChange={(e) => handleEditChange(row.id, 'message', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-100"
                        rows={2}
                      />
                    ) : (
                      <span className="text-zinc-500 text-sm">{row.message}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2 text-violet-400">
                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
                        <span className="text-xs">Analyzing...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {row.aiScore !== undefined && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden w-16">
                              <div
                                className={`h-full rounded-full ${row.aiScore > 80 ? 'bg-cyan-500' : row.aiScore > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                style={{ width: `${row.aiScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-zinc-500">{row.aiScore}%</span>
                          </div>
                        )}
                        {row.aiSuggestion && (
                          <span className="text-[10px] text-zinc-400 italic line-clamp-1">{row.aiSuggestion}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingId(editingId === row.id ? null : row.id)}
                        className="p-2 text-zinc-400 hover:text-violet-600 transition-colors"
                      >
                        {editingId === row.id ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="p-2 text-zinc-400 hover:text-rose-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

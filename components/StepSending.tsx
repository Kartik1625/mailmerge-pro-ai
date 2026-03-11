import React, { useEffect, useState, useRef } from 'react';
import { EmailRecord } from '../types';

interface StepSendingProps {
  data: EmailRecord[];
  fromEmail: string;
  appPassword?: string;

  onFinish: (results: EmailRecord[]) => void;
}

export const StepSending: React.FC<StepSendingProps> = ({ data, fromEmail, appPassword: propsAppPassword, onFinish }) => {
  const [currentResults, setCurrentResults] = useState<EmailRecord[]>([...data]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [senderEmail, setSenderEmail] = useState(fromEmail || "");
  const [appPassword, setAppPassword] = useState(propsAppPassword || "");
  const [hasStarted, setHasStarted] = useState(false);
  const processingRef = useRef(false);

  useEffect(() => {
    if (!hasStarted) return;

    const processQueue = async () => {
      if (currentIndex >= data.length) {
        setTimeout(() => onFinish(currentResults), 1000);
        return;
      }

      if (processingRef.current) return;
      processingRef.current = true;

      const record = currentResults[currentIndex];

      const backendUrl = "https://mailmerge-pro-ai.onrender.com";
      try {
        const response = await fetch(`${backendUrl}/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderEmail: senderEmail,
            appPassword: appPassword,
            access_token: localStorage.getItem('google_access_token'),
            recipient: record.recipient,
            subject: record.subject,
            message: record.message
          }),
        });

        if (response.status === 401) {
          alert("Your Google connection expired or is invalid. Please sign out and sign in again. (Google Access Tokens expire after 1 hour)");
          setTimeout(() => onFinish(currentResults), 500);
          return;
        }

        const result = await response.json();

        setCurrentResults(prev => {
          const next = [...prev];
          next[currentIndex] = {
            ...next[currentIndex],
            status: response.ok ? 'sent' : 'failed'
          };
          return next;
        });

      } catch (error) {
        console.error("Failed to send email", error);
        setCurrentResults(prev => {
          const next = [...prev];
          next[currentIndex] = { ...next[currentIndex], status: 'failed' };
          return next;
        });
      } finally {
        processingRef.current = false;
        setCurrentIndex(prev => prev + 1);
      }
    };

    const timer = setTimeout(processQueue, 1000); // Add a small delay between requests to be safe
    return () => clearTimeout(timer);
  }, [currentIndex, data.length, senderEmail, appPassword, onFinish, hasStarted]);

  const progress = Math.round((currentIndex / data.length) * 100);

  if (!hasStarted) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 p-8 border border-zinc-100">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Final Email Configuration</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Sender Gmail</label>
              <input
                type="email"
                placeholder="Enter your Gmail"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-200 text-zinc-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Gmail App Password</label>
              <input
                type="password"
                placeholder="Enter Gmail App Password"
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-200 text-zinc-700"
              />
            </div>

            <button
              onClick={() => setHasStarted(true)}
              className="w-full py-4 mt-6 bg-violet-600 text-white rounded-xl font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all text-lg"
            >
              Send Emails
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 text-center">
      <div className="mb-12">
        <div className="relative inline-flex mb-8">
          <div className="w-32 h-32 rounded-full border-8 border-zinc-100"></div>
          <svg className="absolute top-0 left-0 w-32 h-32 text-violet-600 transition-all duration-500 ease-linear" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="46"
              fill="none" stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black text-zinc-900">{progress}%</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-zinc-900 mb-2">Sending Emails...</h2>
        <p className="text-zinc-500">Automating your outreach. Please keep this tab open.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 p-6">
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-sm font-bold text-zinc-500 uppercase">Recent Activity</span>
          <span className="text-sm text-violet-600 font-medium">{currentIndex} of {data.length} processed</span>
        </div>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {currentResults.slice(Math.max(0, currentIndex - 5), currentIndex).reverse().map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${record.status === 'sent' ? 'bg-cyan-500' : 'bg-rose-500'}`}></div>
                <span className="text-sm font-medium text-zinc-700">{record.recipient}</span>
              </div>
              <span className={`text-xs font-bold uppercase ${record.status === 'sent' ? 'text-cyan-600' : 'text-rose-600'}`}>
                {record.status}
              </span>
            </div>
          ))}
          {currentIndex === 0 && <p className="text-zinc-400 italic text-sm py-4">Initializing engine...</p>}
        </div>
      </div>
    </div>
  );
};

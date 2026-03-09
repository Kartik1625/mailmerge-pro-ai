import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StepSetup } from './components/StepSetup';
import { StepReview } from './components/StepReview';
import { StepSending } from './components/StepSending';
import { StepReport } from './components/StepReport';
import { Auth } from './components/Auth';
import { AppStep, EmailRecord } from './types';
import { analyzeEmailTones } from './services/geminiService';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';

declare var XLSX: any;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [step, setStep] = useState<AppStep>('setup');
  const [fromEmail, setFromEmail] = useState('');
  const [records, setRecords] = useState<EmailRecord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const parseExcel = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const mapped: EmailRecord[] = json.map((item: any, idx: number) => ({
        id: `row-${idx}-${Date.now()}`,
        recipient: item.Email || item.email || item.Recipient || '',
        subject: item.Subject || item.subject || '',
        message: item.Message || item.message || item.Content || '',
        status: 'pending' as const,
      }));

      setRecords(mapped);
      setStep('review');

      if (mapped.length > 0) {
        setIsAnalyzing(true);
        const results = await analyzeEmailTones(mapped.map(m => ({ subject: m.subject, message: m.message })));
        setRecords(prev => prev.map((rec, i) => {
          const aiData = results.find((r: any) => r.id === i);
          return aiData ? { ...rec, aiScore: aiData.score, aiSuggestion: aiData.suggestion } : rec;
        }));
        setIsAnalyzing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSetupContinue = (email: string, file: File) => {
    setFromEmail(email);
    parseExcel(file);
  };

  const handleUpdateRecords = (updated: EmailRecord[]) => {
    setRecords(updated);
  };

  const handleConfirmSend = () => {
    setStep('sending');
  };

  const handleSendingFinish = (results: EmailRecord[]) => {
    setRecords(results);
    setStep('report');
  };

  const handleReset = () => {
    setStep('setup');
    setRecords([]);
    setFromEmail('');
  };

  if (loadingAuth) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <Auth onSuccess={() => { }} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center justify-center gap-4">
            {[
              { id: 'setup', label: 'Configuration' },
              { id: 'review', label: 'Review' },
              { id: 'sending', label: 'Automation' },
              { id: 'report', label: 'Analytics' }
            ].map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' :
                    ['setup', 'review', 'sending', 'report'].indexOf(step) > idx ? 'bg-cyan-500 text-white' : 'bg-zinc-200 text-zinc-400'
                    }`}>
                    {['setup', 'review', 'sending', 'report'].indexOf(step) > idx ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider mt-2 ${step === s.id ? 'text-violet-600' : 'text-zinc-400'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 3 && <div className={`h-px w-8 md:w-20 -mt-6 ${['setup', 'review', 'sending', 'report'].indexOf(step) > idx ? 'bg-cyan-500' : 'bg-zinc-200'}`}></div>}
              </React.Fragment>
            ))}
          </div>
          <button
            onClick={() => auth.signOut()}
            className="text-sm font-semibold text-zinc-500 hover:text-rose-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {step === 'setup' && <StepSetup userEmail={user?.email || ''} onContinue={handleSetupContinue} />}
      {step === 'review' && <StepReview data={records} onUpdate={handleUpdateRecords} onConfirm={handleConfirmSend} isAnalyzing={isAnalyzing} />}
      {step === 'sending' && <StepSending data={records} fromEmail={fromEmail} onFinish={handleSendingFinish} />}
      {step === 'report' && <StepReport results={records} onReset={handleReset} />}
    </Layout>
  );
};

export default App;


import React, { useRef, useState } from 'react';

declare var XLSX: any;

interface StepSetupProps {
  userEmail: string;
  onContinue: (fromEmail: string, appPassword: string, file: File) => void;
}

export const StepSetup: React.FC<StepSetupProps> = ({ userEmail, onContinue }) => {
  const [fromEmail, setFromEmail] = useState(userEmail);
  const [appPassword, setAppPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      { Email: 'jane.doe@example.com', Subject: 'Welcome to our platform', Message: 'Hi Jane, we are excited to have you on board!' },
      { Email: 'john.smith@company.org', Subject: 'Project Update', Message: 'Hello John, just wanted to check in on the progress of the Q4 report.' },
      { Email: 'support@techstart.io', Subject: 'Bug Report Follow-up', Message: 'Thanks for reaching out. We have resolved the issue you reported.' }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "MailMerge_Template.xlsx");
  };

  const isValid = fromEmail.includes('@') && file;

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3">
        <div className="text-left mb-8">
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">Configure Your Campaign</h2>
          <p className="text-zinc-500">Enter your sender details and upload your recipient list.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 p-8 border border-zinc-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Sender Gmail</label>
              <input
                type="email"
                placeholder="Sender Gmail"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-200 text-zinc-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Gmail App Password</label>
              <input
                type="password"
                placeholder="Gmail App Password"
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-200 text-zinc-700"
              />
            </div>



            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Upload Recipient List (Excel)</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${isDragging ? 'border-violet-500 bg-violet-50' : 'border-zinc-200 hover:border-violet-300'
                  }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-zinc-900 font-medium">{file ? (file as File).name : 'Click or drag Excel file here'}</p>
                  <p className="text-zinc-500 text-sm mt-1">Supports XLSX, XLS, and CSV</p>
                </div>
              </div>
            </div>

            <button
              disabled={!isValid}
              onClick={() => isValid && onContinue(fromEmail, appPassword, file as File)}
              className={`w-full py-4 rounded-xl font-bold transition-all ${isValid
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                }`}
            >
              Review & Continue
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Template Guide
          </h3>
          <p className="text-zinc-400 text-sm mb-6">Ensure your Excel file has these specific column headers for the automation to work correctly:</p>

          <div className="space-y-4 mb-8">
            <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Column 1</div>
              <div className="text-sm font-semibold text-zinc-100">Email</div>
              <div className="text-xs text-zinc-500 mt-1">The recipient's valid email address.</div>
            </div>
            <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Column 2</div>
              <div className="text-sm font-semibold text-zinc-100">Subject</div>
              <div className="text-xs text-zinc-500 mt-1">The headline for your email.</div>
            </div>
            <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Column 3</div>
              <div className="text-sm font-semibold text-zinc-100">Message</div>
              <div className="text-xs text-zinc-500 mt-1">The body content of your email.</div>
            </div>
          </div>

          <button
            onClick={downloadTemplate}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Sample Excel
          </button>
        </div>

        <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
          <h4 className="text-violet-900 font-bold text-sm mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Pro Tip
          </h4>
          <p className="text-violet-700 text-xs leading-relaxed">
            AI analysis runs automatically after you upload to suggest professional tone improvements and engagement scoring.
          </p>
        </div>
      </div>
    </div>
  );
};

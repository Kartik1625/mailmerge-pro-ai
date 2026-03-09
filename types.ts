
export interface EmailRecord {
  id: string;
  recipient: string;
  subject: string;
  message: string;
  status: 'pending' | 'sending' | 'sent' | 'failed';
  aiScore?: number;
  aiSuggestion?: string;
}

export interface MailMergeConfig {
  fromEmail: string;
  excelFile: File | null;
}

export type AppStep = 'setup' | 'review' | 'sending' | 'report';

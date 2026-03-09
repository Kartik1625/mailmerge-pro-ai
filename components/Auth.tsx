import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthProps {
    onSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/gmail.send');
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            if (credential?.accessToken) {
                localStorage.setItem('google_access_token', credential.accessToken);
            }
            onSuccess();
        } catch (error) {
            console.error("Error signing in with Google:", error);
            alert("Failed to sign in. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 p-10 text-center w-full border border-zinc-100">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.092 2.001-.264 2.94m2.094 2.94A13.922 13.922 0 0018 11a8 8 0 10-16 0c0 1.157.172 2.27.485 3.32m2.492 4.095c-.831-.38-1.55-.91-2.126-1.54M15 11h.01M12 15h.01M9 11h.01M15 15h.01" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Welcome Back</h2>
                <p className="text-zinc-500 mb-8">Please sign in to continue using MailMerge Pro AI.</p>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 hover:border-violet-500 hover:bg-violet-50 text-zinc-700 font-bold py-3 px-6 rounded-xl transition-all"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

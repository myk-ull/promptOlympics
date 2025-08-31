'use client';

import { useState } from 'react';

interface EmailConfirmationProps {
  email: string;
  onClose: () => void;
}

export function EmailConfirmation({ email, onClose }: EmailConfirmationProps) {
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleResend = async () => {
    setResendStatus('sending');
    // In a real app, this would trigger a resend
    setTimeout(() => {
      setResendStatus('sent');
      setTimeout(() => setResendStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          {/* Email icon */}
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          
          <p className="text-gray-600 mb-6">
            We've sent a confirmation email to:
            <br />
            <span className="font-semibold text-gray-900">{email}</span>
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Please click the link in the email to verify your account and start playing!
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResend}
              disabled={resendStatus === 'sending'}
              className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
            >
              {resendStatus === 'idle' && "Didn't receive an email? Resend"}
              {resendStatus === 'sending' && "Sending..."}
              {resendStatus === 'sent' && "Email sent! Check your inbox"}
            </button>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Make sure to check your spam folder if you don't see the email
          </p>
        </div>
      </div>
    </div>
  );
}
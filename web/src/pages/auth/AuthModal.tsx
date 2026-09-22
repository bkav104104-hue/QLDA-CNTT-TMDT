import React, { useState } from 'react';
import { BrandLogo } from './components/BrandLogo';
import { MemberBanner } from './components/MemberBanner';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Minus, X, ShieldAlert } from 'lucide-react';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  onClose?: () => void;
  notice?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode = 'login', onClose, notice }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  return (
    <div className="min-h-screen w-full bg-[#eef2f5] flex items-center justify-center p-3 sm:p-6 md:p-8">
      {/* Main Container Card (Split 2 Columns) */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row transition-all duration-300">
        
        {/* LEFT COLUMN: Member Benefits Banner */}
        <div className="w-full lg:w-[50%] flex-shrink-0">
          <MemberBanner />
        </div>

        {/* RIGHT COLUMN: Auth Form Area */}
        <div className="w-full lg:w-[50%] p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white relative">
          {/* Top Header of Right Column */}
          <div className="flex items-center justify-between mb-4">
            <BrandLogo size="md" />

            <div className="flex items-center gap-2">
              {/* Mode Toggle Switcher Pill */}
              <div className="bg-[#f0f4f3] p-0.5 rounded-full flex text-xs font-bold border border-gray-200">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    mode === 'login'
                      ? 'bg-[#009981] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    mode === 'register'
                      ? 'bg-[#009981] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Đăng ký
                </button>
              </div>

              {/* Close Button: Green Circle with minus mark as in Image 2 */}
              <button
                type="button"
                onClick={onClose || (() => alert('Đóng cửa sổ đăng nhập/đăng ký'))}
                title="Đóng"
                className="w-7 h-7 rounded-full bg-[#009981] hover:bg-[#00826e] text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm"
              >
                <Minus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Notice banner if action required login */}
          {notice && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 animate-in fade-in duration-200">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span className="font-bold">{notice}</span>
            </div>
          )}

          {/* Form Content Switching */}
          <div className="flex-1 flex flex-col justify-center">
            {mode === 'login' ? (
              <LoginForm 
                onSwitchToRegister={() => setMode('register')} 
                onSuccess={onClose}
              />
            ) : (
              <RegisterForm 
                onSwitchToLogin={() => setMode('login')} 
                onSuccess={() => {
                  // After register success, user can click to login or close
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


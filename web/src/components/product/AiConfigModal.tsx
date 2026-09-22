import React, { useState } from 'react';
import { Sparkles, Key, Check, X, Shield, ExternalLink, RefreshCw } from 'lucide-react';
import { aiService, DEFAULT_GEMINI_API_KEY, DEFAULT_GEMINI_MODEL } from '../../services/aiService';

interface AiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const AiConfigModal: React.FC<AiConfigModalProps> = ({ isOpen, onClose, onSaved }) => {
  const currentConfig = aiService.getConfig();
  const [apiKey, setApiKey] = useState(currentConfig.apiKey);
  const [model, setModel] = useState(currentConfig.model || DEFAULT_GEMINI_MODEL);
  const [showKey, setShowKey] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    aiService.saveConfig(apiKey.trim(), model.trim());

    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
      onSaved();
      onClose();
    }, 500);
  };

  const handleResetDefault = () => {
    setApiKey(DEFAULT_GEMINI_API_KEY);
    setModel(DEFAULT_GEMINI_MODEL);
    aiService.resetDefaultConfig();
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#005944] via-[#009981] to-[#00b094] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Sparkles className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Cài đặt Google Gemini AI</span>
                <span className="text-[10px] bg-emerald-400 text-slate-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Mặc định
                </span>
              </h3>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Mô hình Gemini 3.6 Flash phân tích trực tiếp điểm nhấn sản phẩm
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
          {/* Active Provider Status Banner */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#009981] text-white flex items-center justify-center font-black text-xs shadow-sm">
                G
              </div>
              <div>
                <p className="text-xs font-extrabold text-gray-900">Google Gemini AI (3.6 Flash)</p>
                <p className="text-[11px] text-gray-500">Mô hình AI đa phương thức tốc độ cao chính thức của Google</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#009981] text-white flex-shrink-0">
              Đang kích hoạt
            </span>
          </div>

          {/* API Key Input */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#009981]" />
                <span>Google Gemini API Key</span>
              </label>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#009981] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 pr-20 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#009981] focus:ring-2 focus:ring-[#009981]/20 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-800 bg-gray-100 rounded-md"
              >
                {showKey ? 'Ẩn' : 'Hiện'}
              </button>
            </div>

            {/* Model Name Input */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Tên mô hình Gemini (Model ID):
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="gemini-3.6-flash"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono text-gray-700 bg-white focus:outline-none focus:border-[#009981]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Khóa API Key của bạn được lưu an toàn trong trình duyệt và kết nối trực tiếp với Google Gemini.</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handleResetDefault}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Khôi phục Key mặc định</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all"
              >
                Đóng
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#009981] hover:bg-[#00826e] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                {savedStatus ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>ĐÃ LƯU!</span>
                  </>
                ) : (
                  <span>LƯU CẤU HÌNH</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

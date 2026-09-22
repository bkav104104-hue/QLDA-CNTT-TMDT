import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Cpu,
  Camera,
  Zap,
  ShieldCheck,
  Award,
  RefreshCw,
  Settings,
  Flame,
  ThumbsUp,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
  Battery,
  Monitor
} from 'lucide-react';
import { ProductDetailData } from '../../data/productData';
import { aiService, AiPerspective, AiSummaryResult } from '../../services/aiService';
import { AiConfigModal } from './AiConfigModal';

interface AiProductSummaryProps {
  product: ProductDetailData;
}

export const AiProductSummary: React.FC<AiProductSummaryProps> = ({ product }) => {
  const [perspective, setPerspective] = useState<AiPerspective>('overview');
  const [summary, setSummary] = useState<AiSummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const fetchSummary = async (persp: AiPerspective = perspective) => {
    setLoading(true);
    try {
      const result = await aiService.summarizeProduct(product, persp);
      setSummary(result);
    } catch (err) {
      console.error('Lỗi tóm tắt AI:', err);
      // Fallback to internal generator
      setSummary(aiService.generateSmartSummary(product, persp));
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever product or perspective changes
  useEffect(() => {
    fetchSummary(perspective);
  }, [product.id, perspective]);

  const handleCopySummary = () => {
    if (!summary) return;
    const text = `✨ ${summary.title}\n${summary.tagline}\n\n` +
      summary.highlights.map((h, i) => `${i + 1}. ${h.title}: ${h.description}`).join('\n') +
      `\n\n🎯 Nhận định: ${summary.verdict}\n👉 Phù hợp: ${summary.recommendedFor}\n(Nguồn: NextPhone AI Insight)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHighlightIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'cpu':
        return <Cpu className="w-5 h-5 text-indigo-500" />;
      case 'camera':
        return <Camera className="w-5 h-5 text-rose-500" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'battery':
        return <Battery className="w-5 h-5 text-emerald-600" />;
      case 'display':
      case 'screen':
        return <Monitor className="w-5 h-5 text-cyan-600" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#009981]" />;
    }
  };

  const perspectives: { id: AiPerspective; label: string; icon: string }[] = [
    { id: 'overview', label: 'Tất cả điểm nổi bật', icon: '✨' },
    { id: 'gaming', label: 'Chiến Game & Hiệu năng', icon: '🎮' },
    { id: 'camera', label: 'Camera & Nhiếp ảnh', icon: '📸' },
    { id: 'pros_cons', label: 'Ưu & Cần lưu ý', icon: '⚖️' },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-[#f0fdf9] via-white to-[#f0fdf4] rounded-3xl border-2 border-emerald-300/80 shadow-lg shadow-emerald-500/5 p-5 sm:p-7 relative overflow-hidden transition-all duration-300">
      {/* Decorative Cyber Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-emerald-400/15 via-teal-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-gradient-to-tr from-cyan-400/10 via-emerald-300/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-4">
        <div className="flex items-center gap-3">
          {/* Animated AI Sparkle Orb */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#005944] via-[#009981] to-[#10b981] p-0.5 shadow-md shadow-emerald-600/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#005944]/40 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-emerald-200 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                <span>NextPhone AI</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009981] to-teal-600">
                  Insights
                </span>
              </h2>

              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-[#007f66] uppercase tracking-wider">
                <Flame className="w-3 h-3 text-emerald-600" />
                Tóm tắt tự động
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-0.5 font-medium flex items-center gap-1.5">
              <span>Được phân tích bởi:</span>
              <strong className="text-[#007f66]">
                {summary ? summary.providerName : 'NextPhone Smart Engine'}
              </strong>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Regenerate Button */}
          <button
            type="button"
            onClick={() => fetchSummary(perspective)}
            disabled={loading}
            className="p-2 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#009981] transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
            title="Tạo lại bản tóm tắt bằng AI"
          >
            <RefreshCw className={`w-4 h-4 text-[#009981] ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          {/* AI Settings Button */}
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="p-2 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#009981] transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Cài đặt API Key (Gemini, DeepSeek, Grok, OpenAI)"
          >
            <Settings className="w-4 h-4 text-[#009981]" />
            <span className="hidden sm:inline">Cài đặt API Key</span>
          </button>
        </div>
      </div>

      {/* Perspective Filter Pills */}
      <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto py-3.5 scrollbar-none">
        <span className="text-[11px] font-bold text-gray-500 flex-shrink-0 mr-1 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-[#009981]" />
          <span>Góc nhìn:</span>
        </span>
        {perspectives.map((p) => {
          const isSelected = perspective === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPerspective(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#009981] to-[#007f66] text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                  : 'bg-white/80 border border-gray-200/90 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Summary Content Body */}
      <div className="relative z-10 pt-1">
        {loading ? (
          /* Shimmering Skeleton Loader */
          <div className="space-y-4 py-4 animate-pulse">
            <div className="h-5 bg-emerald-200/50 rounded-lg w-2/3" />
            <div className="h-3 bg-emerald-100 rounded-md w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-white/70 rounded-2xl border border-emerald-100 space-y-2">
                  <div className="h-4 bg-emerald-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                </div>
              ))}
            </div>
          </div>
        ) : summary ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Title & Tagline */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
                {summary.title}
              </h3>
              <p className="text-xs font-semibold text-[#007f66] italic flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>"{summary.tagline}"</span>
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {summary.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-start gap-3.5 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    {getHighlightIcon(item.icon)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 leading-tight">
                        {item.title}
                      </h4>
                      {item.score && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-50 text-[#009981] border border-emerald-200/60 flex-shrink-0">
                          {item.score}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Verdict Box */}
            <div className="p-4 bg-gradient-to-r from-emerald-100/70 via-teal-50 to-emerald-50 border border-emerald-200/70 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#005944]">
                  <Award className="w-4 h-4 text-[#009981]" />
                  <span>Đúc kết của chuyên gia NextPhone:</span>
                </div>
                <p className="text-gray-800 font-medium leading-relaxed">
                  {summary.verdict}
                </p>
                <p className="text-[11px] text-gray-500 pt-0.5">
                  🎯 <strong>Phù hợp nhất:</strong> {summary.recommendedFor}
                </p>
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                    liked
                      ? 'bg-[#009981] text-white border-[#009981]'
                      : 'bg-white border-emerald-200 text-gray-600 hover:text-[#009981]'
                  }`}
                  title="Hữu ích"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Hữu ích</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="p-2 rounded-xl bg-white border border-emerald-200 text-gray-600 hover:text-[#009981] hover:border-emerald-300 text-xs font-semibold flex items-center gap-1 transition-all shadow-sm active:scale-95"
                  title="Sao chép tóm tắt AI"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span className="text-[11px] text-emerald-600 font-bold">Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Config Modal */}
      <AiConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSaved={() => fetchSummary(perspective)}
      />
    </section>
  );
};


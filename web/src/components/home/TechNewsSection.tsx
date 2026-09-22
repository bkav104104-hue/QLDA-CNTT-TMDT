import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Clock, Eye, ChevronRight, BookOpen, X } from 'lucide-react';
import { categoryService, TechNewsArticle } from '../../services/categoryService';

interface TechNewsSectionProps {
  onBackToProducts?: () => void;
}

export const TechNewsSection: React.FC<TechNewsSectionProps> = ({ onBackToProducts }) => {
  const [articles, setArticles] = useState<TechNewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<TechNewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    categoryService.getHotNews().then((data) => {
      setArticles(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div id="tech-news-section" className="w-full space-y-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-2xl p-4 md:p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-black uppercase tracking-tight">
                TIN HOT CÔNG NGHỆ NEXTPHONE
              </h2>
              <span className="bg-yellow-400 text-red-950 font-black text-[9px] px-1.5 py-0.5 rounded uppercase">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-rose-100 font-medium">
              Cập nhật liên tục tin tức thị trường, đánh giá chuyên sâu và tóm tắt bởi Gemini AI
            </p>
          </div>
        </div>

        {onBackToProducts && (
          <button
            type="button"
            onClick={onBackToProducts}
            className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap self-end sm:self-auto"
          >
            ← Xem sản phẩm khác
          </button>
        )}
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse space-y-3">
              <div className="h-40 bg-gray-200 rounded-xl w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <div 
              key={article.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Image & Category Tag */}
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <img 
                  src={article.thumbnailUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {article.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <h3 
                    onClick={() => setSelectedArticle(article)}
                    className="font-extrabold text-sm text-gray-900 line-clamp-2 hover:text-[#009981] transition-colors cursor-pointer"
                  >
                    {article.title}
                  </h3>

                  {/* AI Quick Highlight Box */}
                  <div className="mt-2 p-2 bg-emerald-50/80 border border-emerald-200 rounded-xl text-[11px] text-[#006650] flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#009981] flex-shrink-0 mt-0.5" />
                    <p className="line-clamp-2 leading-relaxed">
                      <strong>AI Tóm tắt:</strong> {article.aiSummary}
                    </p>
                  </div>

                  <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Eye className="w-3 h-3" />
                      {article.viewCount} lượt xem
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="text-[#009981] hover:text-[#00705c] font-bold flex items-center gap-0.5 cursor-pointer text-xs group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Chi tiết</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 md:p-6 relative space-y-4">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-lg">
              {selectedArticle.category}
            </span>

            <h2 className="text-lg md:text-xl font-black text-gray-900 leading-snug">
              {selectedArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-gray-400 pb-2 border-b border-gray-100">
              <span>Tác giả: <strong className="text-gray-700">{selectedArticle.author}</strong></span>
              <span>{new Date(selectedArticle.publishedAt).toLocaleDateString('vi-VN')}</span>
              <span>{selectedArticle.viewCount} lượt xem</span>
            </div>

            {/* AI Summary Highlight */}
            <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-start gap-3 shadow-sm">
              <Sparkles className="w-5 h-5 text-[#009981] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-extrabold text-[#006650] uppercase tracking-wide mb-1">
                  Điểm nhấn quan trọng (Gemini AI phân tích)
                </p>
                <p className="text-xs text-[#004d3d] leading-relaxed">
                  {selectedArticle.aiSummary}
                </p>
              </div>
            </div>

            <img 
              src={selectedArticle.thumbnailUrl} 
              alt={selectedArticle.title}
              className="w-full h-64 object-cover rounded-xl"
            />

            <div className="text-xs md:text-sm text-gray-700 space-y-3 leading-relaxed">
              <p className="font-semibold text-gray-800">{selectedArticle.summary}</p>
              <p>{selectedArticle.content}</p>
              <p>NextPhone cam kết đem đến những trải nghiệm công nghệ mới nhất cùng chính sách bảo hành chính hãng và hỗ trợ thu cũ đổi mới tối đa cho quý khách hàng.</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-[#009981] hover:bg-[#00826e] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Đóng bài viết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TechNewsSection;


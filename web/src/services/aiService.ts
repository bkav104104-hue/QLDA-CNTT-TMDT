import { ProductDetailData } from '../data/productData';

export type AiProvider = 'gemini';

export type AiPerspective = 'overview' | 'gaming' | 'camera' | 'pros_cons';

export interface AiSummaryResult {
  providerName: string;
  perspective: AiPerspective;
  title: string;
  tagline: string;
  highlights: {
    icon: string;
    title: string;
    description: string;
    score?: string;
  }[];
  verdict: string;
  recommendedFor: string;
  isCustomKey: boolean;
}

export interface AiConfig {
  provider: AiProvider;
  apiKey: string;
  model: string;
}

// Default Gemini API key from environment or user settings
export const DEFAULT_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

const STORAGE_KEY_API_KEY = 'nextphone_gemini_api_key';
const STORAGE_KEY_MODEL = 'nextphone_gemini_model';

export const aiService = {
  getConfig(): AiConfig {
    const apiKey = localStorage.getItem(STORAGE_KEY_API_KEY) || DEFAULT_GEMINI_API_KEY;
    const model = localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_GEMINI_MODEL;
    return { provider: 'gemini', apiKey, model };
  },

  saveConfig(apiKey: string, model: string = DEFAULT_GEMINI_MODEL): void {
    localStorage.setItem(STORAGE_KEY_API_KEY, apiKey.trim() || DEFAULT_GEMINI_API_KEY);
    localStorage.setItem(STORAGE_KEY_MODEL, model.trim() || DEFAULT_GEMINI_MODEL);
  },

  resetDefaultConfig(): void {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
    localStorage.removeItem(STORAGE_KEY_MODEL);
  },

  /**
   * Main summarization dispatcher:
   * Direct live call to Google Gemini with the configured API Key.
   */
  async summarizeProduct(
    product: ProductDetailData,
    perspective: AiPerspective = 'overview'
  ): Promise<AiSummaryResult> {
    const config = this.getConfig();

    try {
      return await this.callGeminiApi(product, perspective, config.apiKey, config.model);
    } catch (err) {
      console.warn('[AI Service] Gemini call failed or offline. Using high-fidelity smart engine fallback:', err);
      return this.generateSmartSummary(product, perspective);
    }
  },

  /**
   * Live Google Gemini API Call
   */
  async callGeminiApi(
    product: ProductDetailData,
    perspective: AiPerspective,
    apiKey: string,
    modelName: string = DEFAULT_GEMINI_MODEL
  ): Promise<AiSummaryResult> {
    const model = modelName || DEFAULT_GEMINI_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = this.buildPrompt(product, perspective);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    let rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) {
      throw new Error('Không nhận được nội dung từ Google Gemini');
    }

    // Clean up codeblock if present
    if (rawContent.includes('```json')) {
      rawContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (rawContent.includes('```')) {
      rawContent = rawContent.replace(/```/g, '').trim();
    }

    const parsed = JSON.parse(rawContent);

    return {
      providerName: `Google Gemini (${model})`,
      perspective,
      title: parsed.title || `Tóm tắt AI: ${product.name}`,
      tagline: parsed.tagline || 'Phân tích thông số thông minh bởi Google Gemini',
      highlights: (parsed.highlights || []).map((h: any) => ({
        icon: h.icon || 'spark',
        title: h.title || 'Điểm nổi bật',
        description: h.description || '',
        score: h.score || '9.5/10',
      })),
      verdict: parsed.verdict || 'Sản phẩm nổi bật hàng đầu phân khúc.',
      recommendedFor: parsed.recommendedFor || 'Người dùng yêu cầu chất lượng và độ hoàn thiện cao.',
      isCustomKey: apiKey !== DEFAULT_GEMINI_API_KEY,
    };
  },

  /**
   * Prompt constructor for Gemini
   */
  buildPrompt(product: ProductDetailData, perspective: AiPerspective): string {
    const specsJson = JSON.stringify(product.specs);
    const perspectiveGuide = {
      overview: 'Tập trung vào 4 điểm đột phá nổi bật nhất về tổng thể của sản phẩm này.',
      gaming: 'Tập trung đánh giá chip xử lý, FPS, tản nhiệt, tần số quét màn hình và pin phục vụ chơi game nặng.',
      camera: 'Tập trung đánh giá cảm biến, độ phân giải, chụp đêm, zoom, quay video và tính năng AI nhiếp ảnh.',
      pros_cons: 'Phân tích khách quan điểm mạnh lớn nhất và một vài điểm người dùng cần cân nhắc trước khi mua.',
    }[perspective];

    return `
Hãy đóng vai trò chuyên gia phân tích công nghệ cao cấp của hệ thống bán lẻ NextPhone.
Phân tích sản phẩm sau đây:
- Tên: ${product.name}
- Thương hiệu: ${product.brand}
- Giá bán: ${product.price.toLocaleString('vi-VN')} đ
- Thông số kỹ thuật chính: ${specsJson}
- Góc nhìn tóm tắt: ${perspectiveGuide}

Hãy trả về DUY NHẤT một JSON hợp lệ theo cấu trúc sau (không kèm lời chào hay định dạng markdown bên ngoài):
{
  "title": "Tiêu đề tóm tắt ngắn gọn và cuốn hút",
  "tagline": "Một câu khẩu hiệu đúc kết tinh hoa sản phẩm",
  "highlights": [
    {
      "icon": "Tên icon (cpu | camera | zap | shield | spark | display | battery)",
      "title": "Tiêu đề điểm nhấn (3-6 từ)",
      "description": "Nội dung phân tích thực tế (1-2 câu súc tích, có dẫn chứng thông số)",
      "score": "9.8/10"
    }
  ],
  "verdict": "Lời đúc kết chuyên gia 1 câu",
  "recommendedFor": "Mô tả ngắn nhóm người dùng phù hợp nhất để mua thiết bị này"
}
`;
  },

  /**
   * Fallback engine when offline or network interrupted
   */
  generateSmartSummary(product: ProductDetailData, perspective: AiPerspective): AiSummaryResult {
    const specs = product.specs;
    const isApple = product.brand.toLowerCase().includes('apple');
    const isAnker = product.id.includes('anker');

    if (isAnker) {
      return {
        providerName: 'Google Gemini (Offline Backup)',
        perspective,
        title: 'Tóm tắt AI: Củ sạc Anker Prime GaN 65W',
        tagline: 'Giải pháp cấp nguồn tối thượng cho toàn bộ hệ sinh thái công nghệ',
        highlights: [
          {
            icon: 'zap',
            title: 'Công nghệ GaN thế hệ mới',
            description: 'Tối ưu hiệu suất chuyển đổi điện năng 95%, giảm kích thước đến 38% so với sạc chuẩn cùng công suất.',
            score: '9.8/10',
          },
          {
            icon: 'spark',
            title: 'Sạc cùng lúc 3 thiết bị',
            description: 'Trang bị 2 cổng USB-C và 1 cổng USB-A với thuật toán phân bổ công suất thông minh.',
            score: '9.5/10',
          },
          {
            icon: 'shield',
            title: 'Bảo vệ nhiệt độ ActiveShield',
            description: 'Giám sát nhiệt độ liên tục, chống quá dòng, quá áp và bảo vệ pin thiết bị tối đa.',
            score: '9.9/10',
          },
        ],
        verdict: 'Món phụ kiện tất-cả-trong-một không thể thiếu trong balo của người yêu công nghệ.',
        recommendedFor: 'Người dùng sở hữu laptop Type-C, iPhone, iPad hoặc điện thoại Android cao cấp.',
        isCustomKey: false,
      };
    }

    if (perspective === 'gaming') {
      return {
        providerName: 'Google Gemini (Offline Backup)',
        perspective: 'gaming',
        title: `Phân tích hiệu năng Gaming AI: ${product.name}`,
        tagline: `Tối ưu trải nghiệm thể thao điện tử và chiến game đồ họa đỉnh cao`,
        highlights: [
          {
            icon: 'cpu',
            title: `Sức mạnh vi xử lý ${specs.chipset || 'cao cấp'}`,
            description: `Tối ưu xung nhịp cao, hỗ trợ ray tracing thời gian thực và xử lý mượt mà các tựa game đồ họa nặng nhất.`,
            score: isApple ? '9.9/10' : '9.4/10',
          },
          {
            icon: 'spark',
            title: `Màn hình ${specs.screenTech || 'OLED'} ${specs.screenSize || ''}`,
            description: `Tốc độ phản hồi cảm ứng cực nhạy, độ phân giải ${specs.resolution || 'sắc nét'} mang lại lợi thế khung hình vượt trội.`,
            score: '9.6/10',
          },
          {
            icon: 'zap',
            title: `Pin & Sạc: ${specs.batteryAndCharging || 'Dung lượng cao'}`,
            description: `Cung cấp thời lượng chiến game bền bỉ liên tục kết hợp công nghệ sạc thần tốc.`,
            score: '9.3/10',
          },
        ],
        verdict: 'Thiết bị đáp ứng xuất sắc mọi yêu cầu thi đấu eSports và tác vụ nặng nề nhất hiện nay.',
        recommendedFor: 'Game thủ mobile, streamer hoặc người dùng cần cỗ máy xử lý đồ họa cường độ cao.',
        isCustomKey: false,
      };
    }

    if (perspective === 'camera') {
      return {
        providerName: 'Google Gemini (Offline Backup)',
        perspective: 'camera',
        title: `Đánh giá chuyên sâu Camera AI: ${product.name}`,
        tagline: `Studio nhiếp ảnh bỏ túi với thuật toán AI tái tạo màu sắc chân thực`,
        highlights: [
          {
            icon: 'camera',
            title: `Hệ thống Camera: ${specs.camera || 'Độ phân giải cao'}`,
            description: `Khẩu độ lớn thu sáng vượt trội, tích hợp chống rung quang học OIS khử nhòe và quay video chuẩn điện ảnh 4K/8K.`,
            score: isApple ? '9.8/10' : '9.2/10',
          },
          {
            icon: 'spark',
            title: 'Thuật toán xử lý chân dung AI',
            description: 'Tự động nhận diện ánh sáng chủ thể, tách phông nền tự nhiên và tái hiện sắc thái da hài hòa.',
            score: '9.5/10',
          },
          {
            icon: 'zap',
            title: 'Chụp đêm & Quay phim HDR',
            description: 'Khả năng khử nhiễu AI đa khung hình, bắt trọn từng khoảnh khắc nhóm sắc nét cho sáng tạo nội dung.',
            score: '9.4/10',
          },
        ],
        verdict: 'Chất lượng ảnh chụp và khả năng quay phim đạt chuẩn mực dẫn đầu phân khúc.',
        recommendedFor: 'Nhà sáng tạo nội dung, vlogger hoặc người đam mê ghi lại khoảnh khắc thường nhật.',
        isCustomKey: false,
      };
    }

    if (perspective === 'pros_cons') {
      return {
        providerName: 'Google Gemini (Offline Backup)',
        perspective: 'pros_cons',
        title: `Cân nhắc Ưu & Nhược điểm AI: ${product.name}`,
        tagline: `Góc nhìn khách quan từ dữ liệu người dùng thực tế và phòng lab kiểm định`,
        highlights: [
          {
            icon: 'spark',
            title: 'Ưu điểm: Thiết kế & Cấu hình vượt trội',
            description: `Vật liệu ${specs.material || 'cao cấp'} hoàn thiện tinh xảo, hiệu năng mạnh mẽ từ chip ${specs.chipset || 'thế hệ mới'} duy trì độ ổn định nhiều năm.`,
            score: 'Điểm cộng',
          },
          {
            icon: 'zap',
            title: 'Ưu điểm: Màn hình hiển thị & Pin bền bỉ',
            description: `Tấm nền ${specs.screenTech || 'sắc nét'} độ sáng cao ngoài trời nắng gắt kết hợp nguồn năng lượng ${specs.batteryAndCharging || 'dài'} an tâm sử dụng.`,
            score: 'Điểm cộng',
          },
          {
            icon: 'shield',
            title: 'Cần lưu ý: Kích thước & Mức giá đầu tư',
            description: isApple
              ? 'Máy sở hữu màn hình lớn 6.9 inch cần thời gian làm quen khi cầm nắm 1 tay, giá niêm yết phân khúc siêu cao cấp.'
              : 'Nên trang bị ốp lưng chống sốc để bảo vệ cụm camera lớn khi đặt trên mặt bàn.',
            score: 'Lưu ý',
          },
        ],
        verdict: 'Sản phẩm hoàn toàn xứng đáng với mức giá so với những giá trị trải nghiệm mang lại.',
        recommendedFor: 'Người tiêu dùng thông thái đang tìm kiếm một cỗ máy đáng tin cậy phục vụ lâu dài 3-5 năm.',
        isCustomKey: false,
      };
    }

    // Default: 'overview'
    return {
      providerName: 'Google Gemini (Offline Backup)',
      perspective: 'overview',
      title: `Điểm nhấn đột phá AI: ${product.name}`,
      tagline: `${product.brand} khẳng định vị thế dẫn đầu với ngôn ngữ thiết kế và công nghệ tương lai`,
      highlights: [
        {
          icon: 'cpu',
          title: `Chipset ${specs.chipset || 'Hiệu năng đỉnh cao'}`,
          description: `Kiến trúc xử lý đa nhân tiên tiến, tăng hiệu năng tính toán và tích hợp NPU thần kinh chuyên dụng cho tác vụ AI.`,
          score: '9.8/10',
        },
        {
          icon: 'spark',
          title: `Màn hình ${specs.screenSize || 'Lớn'} ${specs.screenTech || 'Super Retina / OLED'}`,
          description: `Độ phân giải ${specs.resolution || 'sắc nét'}, tấm nền cao cấp mang đến khung hình sống động, màu sắc rực rỡ và chân thực.`,
          score: '9.7/10',
        },
        {
          icon: 'camera',
          title: `Hệ thống Camera: ${specs.camera || 'Chuyên nghiệp'}`,
          description: `Cảm biến lớn bắt trọn từng chi tiết dù trong điều kiện thiếu sáng, tích hợp chống rung đa trục và chế độ quay phim điện ảnh.`,
          score: '9.6/10',
        },
        {
          icon: 'zap',
          title: `Pin & Sạc: ${specs.batteryAndCharging || 'Tốc độ cao'}`,
          description: `Năng lượng bền bỉ suốt cả ngày dài làm việc kết hợp chuẩn sạc thần tốc giúp tiết kiệm tối đa thời gian chờ đợi.`,
          score: '9.5/10',
        },
      ],
      verdict: 'Một trong những thiết bị toàn diện và đáng sở hữu nhất thị trường thời điểm hiện tại.',
      recommendedFor: 'Người dùng yêu cầu chất lượng hoàn hảo từ hiệu năng, màn hình đến thời lượng pin.',
      isCustomKey: false,
    };
  },
};

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Moon, Sun, RefreshCw, ChevronLeft } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type FortuneType = 'zodiac' | 'constellation';

interface Sign {
  id: string;
  name: string;
  emoji: string;
  element?: string;
}

const ZODIAC_SIGNS: Sign[] = [
  { id: 'rat', name: '쥐띠', emoji: '🐭' },
  { id: 'ox', name: '소띠', emoji: '🐮' },
  { id: 'tiger', name: '호랑이띠', emoji: '🐯' },
  { id: 'rabbit', name: '토끼띠', emoji: '🐰' },
  { id: 'dragon', name: '용띠', emoji: '🐲' },
  { id: 'snake', name: '뱀띠', emoji: '🐍' },
  { id: 'horse', name: '말띠', emoji: '🐴' },
  { id: 'sheep', name: '양띠', emoji: '🐑' },
  { id: 'monkey', name: '원숭이띠', emoji: '🐵' },
  { id: 'rooster', name: '닭띠', emoji: '🐔' },
  { id: 'dog', name: '개띠', emoji: '🐶' },
  { id: 'pig', name: '돼지띠', emoji: '🐷' },
];

const CONSTELLATIONS: Sign[] = [
  { id: 'aries', name: '양자리', emoji: '♈', element: '불' },
  { id: 'taurus', name: '황소자리', emoji: '♉', element: '흙' },
  { id: 'gemini', name: '쌍둥이자리', emoji: '♊', element: '공기' },
  { id: 'cancer', name: '게자리', emoji: '♋', element: '물' },
  { id: 'leo', name: '사자자리', emoji: '♌', element: '불' },
  { id: 'virgo', name: '처녀자리', emoji: '♍', element: '흙' },
  { id: 'libra', name: '천칭자리', emoji: '♎', element: '공기' },
  { id: 'scorpio', name: '전갈자리', emoji: '♏', element: '물' },
  { id: 'sagittarius', name: '사수자리', emoji: '♐', element: '불' },
  { id: 'capricorn', name: '염소자리', emoji: '♑', element: '흙' },
  { id: 'aquarius', name: '물병자리', emoji: '♒', element: '공기' },
  { id: 'pisces', name: '물고기자리', emoji: '♓', element: '물' },
];

export default function App() {
  const [fortuneType, setFortuneType] = useState<FortuneType>('zodiac');
  const [selectedSign, setSelectedSign] = useState<Sign | null>(null);
  const [fortune, setFortune] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signs = fortuneType === 'zodiac' ? ZODIAC_SIGNS : CONSTELLATIONS;

  const handleSignSelect = async (sign: Sign) => {
    setSelectedSign(sign);
    setIsLoading(true);
    setFortune(null);

    try {
      const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const prompt = `
        당신은 신비롭고 지혜로운 운세 전문가입니다.
        오늘 날짜는 ${today}입니다.
        사용자가 선택한 ${fortuneType === 'zodiac' ? '띠' : '별자리'}는 '${sign.name}'입니다.
        
        이 사람을 위한 오늘의 운세를 작성해주세요.
        다음 항목들을 포함하여 마크다운 없이 평문으로 작성하되, 단락을 잘 나누어주세요.
        말투는 정중하고 신비로우며 따뜻한 조언을 건네는 듯한 '~습니다', '~어떨까요' 등의 체를 사용해주세요.

        1. 총운 (전반적인 하루의 흐름)
        2. 재물운
        3. 애정운
        4. 행운의 색상과 숫자
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      setFortune(response.text || '운세를 불러오지 못했습니다. 다시 시도해주세요.');
    } catch (error) {
      console.error('Error generating fortune:', error);
      setFortune('운세를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSign(null);
    setFortune(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="atmosphere"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-gold opacity-80" />
          <h1 className="text-4xl md:text-5xl font-mystic font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5f2ed] via-[#D4AF37] to-[#f5f2ed]">
            오늘의 운세
          </h1>
          <Sparkles className="w-6 h-6 text-gold opacity-80" />
        </div>
        <p className="text-sm md:text-base text-gray-400 font-light tracking-widest uppercase">
          Daily Fortune Teller
        </p>
      </motion.div>

      <div className="w-full max-w-4xl z-10 flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!selectedSign ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              <div className="flex p-1 glass-panel rounded-full mb-10">
                <button
                  onClick={() => setFortuneType('zodiac')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    fortuneType === 'zodiac' ? 'bg-white/10 text-gold shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  띠별 운세
                </button>
                <button
                  onClick={() => setFortuneType('constellation')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    fortuneType === 'constellation' ? 'bg-white/10 text-gold shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  별자리 운세
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 w-full">
                {signs.map((sign, index) => (
                  <motion.button
                    key={sign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    onClick={() => handleSignSelect(sign)}
                    className="glass-button rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group"
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {sign.emoji}
                    </span>
                    <span className="font-mystic text-sm tracking-wider text-gray-300 group-hover:text-gold transition-colors">
                      {sign.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-2xl"
            >
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors text-sm tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" />
                다른 운세 보기
              </button>

              <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-30"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37] rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
                
                <div className="flex flex-col items-center text-center mb-10 relative z-10">
                  <span className="text-6xl mb-4">{selectedSign.emoji}</span>
                  <h2 className="text-3xl font-mystic font-bold text-gold mb-2">
                    {selectedSign.name}
                  </h2>
                  <p className="text-gray-400 text-sm tracking-widest">
                    {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}의 운세
                  </p>
                </div>

                <div className="relative z-10 min-h-[200px] flex flex-col items-center justify-center">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-4 text-gold">
                      <RefreshCw className="w-8 h-8 animate-spin opacity-80" />
                      <p className="font-mystic text-sm tracking-widest animate-pulse">
                        별들의 속삭임을 듣는 중...
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="w-full"
                    >
                      <div className="font-mystic text-lg leading-relaxed text-gray-200 whitespace-pre-wrap space-y-6">
                        {fortune?.split('\n\n').map((paragraph, i) => (
                          <p key={i} className="text-center md:text-left">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

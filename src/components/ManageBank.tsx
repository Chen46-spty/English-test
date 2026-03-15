import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Image as ImageIcon, Loader2, Check, AlertCircle, Trash2, Plus, PlayCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useQuizStore } from '../store/useQuizStore';
import { useShallow } from 'zustand/react/shallow';
import { QuizItem } from '../types';

export const ManageBank: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'current'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<Omit<QuizItem, 'id'>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { allQuizData, addQuizItems, setStep, removeQuizItem, clearAllQuizData } = useQuizStore(
    useShallow((state) => ({
      allQuizData: state.allQuizData,
      addQuizItems: state.addQuizItems,
      setStep: state.setStep,
      removeQuizItem: state.removeQuizItem,
      clearAllQuizData: state.clearAllQuizData
    }))
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResults([]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const base64Data = selectedImage.split(',')[1];

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                text: "你是一個嚴謹的教材提取助手。請『僅提取』這張英文課本圖片中出現的單字與句子。嚴禁自行發想或增加圖片中不存在的內容。請將提取內容分類為 'vocabulary' (單字) 或 'grammar' (句子/對話)。為每一項提供準確的中文翻譯 (chinese_prompt) 與圖片中對應的英文 (english_answer)。請以 JSON 陣列格式回傳：[{\"type\": \"grammar\" | \"vocabulary\", \"chinese_prompt\": \"...\", \"english_answer\": \"...\"}]。"
              },
              {
                inlineData: {
                  mimeType: "image/png",
                  data: base64Data
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["grammar", "vocabulary"] },
                chinese_prompt: { type: Type.STRING },
                english_answer: { type: Type.STRING }
              },
              required: ["type", "chinese_prompt", "english_answer"]
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const results = JSON.parse(text);
        setAnalysisResults(results);
      }
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError("分析圖片時發生錯誤，請確認圖片清晰度或稍後再試。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (analysisResults.length > 0) {
      addQuizItems(analysisResults);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setAnalysisResults([]);
      setSelectedImage(null);
      setActiveTab('current');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800 text-center md:text-left">題庫範圍管理</h1>
          <p className="text-slate-500 text-center md:text-left">確保所有測驗題目皆符合你的教學範圍</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            AI 掃描新增
          </button>
          <button 
            onClick={() => setActiveTab('current')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'current' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            現有題庫 ({allQuizData.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'upload' ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* 左側：上傳區 */}
            <div className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[300px] ${
                  selectedImage ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                {selectedImage ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={selectedImage} 
                      alt="Preview" 
                      className="max-h-[400px] rounded-xl shadow-md object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                        setAnalysisResults([]);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-blue-100 rounded-full mb-4">
                      <Upload className="w-10 h-10 text-blue-600" />
                    </div>
                    <p className="text-lg font-semibold text-slate-700">點擊或拖曳圖片至此</p>
                    <p className="text-slate-400 text-sm mt-1">請上傳課本照片，AI 將嚴格提取內容</p>
                  </>
                )}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>

              {selectedImage && !isAnalyzing && analysisResults.length === 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={analyzeImage}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center justify-center"
                >
                  <ImageIcon className="w-6 h-6 mr-2" />
                  開始 AI 內容提取
                </motion.button>
              )}

              {isAnalyzing && (
                <div className="w-full bg-slate-100 py-4 rounded-2xl flex items-center justify-center text-slate-600 font-medium">
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  正在嚴格提取圖片內容...
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}
            </div>

            {/* 右側：解析結果 */}
            <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-700 flex items-center">
                待新增內容
                {analysisResults.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                    {analysisResults.length} 筆
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-emerald-600 text-sm font-bold"
                  >
                    儲存成功！
                  </motion.span>
                )}
                {analysisResults.length > 0 && (
                  <button 
                    onClick={handleSave}
                    className="flex items-center text-emerald-600 font-bold hover:bg-emerald-50 px-3 py-1 rounded-lg transition-colors"
                  >
                    <Check className="w-5 h-5 mr-1" />
                    確認匯入題庫
                  </button>
                )}
              </div>
            </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {analysisResults.length === 0 && !isAnalyzing && (
                  <div className="h-[300px] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-3xl">
                    <Plus className="w-12 h-12 mb-2 opacity-20" />
                    <p>尚未提取任何內容</p>
                  </div>
                )}

                {analysisResults.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative group">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          item.type === 'grammar' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'
                        }`}>
                          {item.type === 'grammar' ? '文法' : '單字'}
                        </span>
                        <p className="font-bold text-slate-800">{item.chinese_prompt}</p>
                        <p className="text-slate-500 text-sm italic">{item.english_answer}</p>
                      </div>
                      <button 
                        onClick={() => setAnalysisResults(prev => prev.filter((_, i) => i !== index))}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="current"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-700">目前題庫範圍</h2>
              <div className="flex items-center gap-4">
                <p className="text-sm text-slate-400 hidden md:block">測驗題目將嚴格從以下內容中隨機抽選</p>
                {allQuizData.length > 0 && (
                  <div className="flex items-center gap-2">
                    {showClearConfirm ? (
                      <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                        <span className="text-red-600 text-xs font-bold">確定清空？</span>
                        <button 
                          onClick={() => {
                            clearAllQuizData();
                            setShowClearConfirm(false);
                          }}
                          className="text-red-700 hover:underline text-xs font-bold"
                        >
                          是
                        </button>
                        <button 
                          onClick={() => setShowClearConfirm(false)}
                          className="text-slate-500 hover:underline text-xs font-bold"
                        >
                          否
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowClearConfirm(true)}
                        className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        清空題庫
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allQuizData.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 group relative">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        item.type === 'grammar' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'
                      }`}>
                        {item.type === 'grammar' ? '文法' : '單字'}
                      </span>
                      <button 
                        onClick={() => removeQuizItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-bold text-slate-800">{item.chinese_prompt}</p>
                    <p className="text-slate-500 text-sm italic">{item.english_answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-8 border-t border-slate-100 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStep('home')}
          className="flex items-center px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
        >
          <PlayCircle className="w-6 h-6 mr-2" />
          進行測驗
        </motion.button>
      </div>
    </div>
  );
};

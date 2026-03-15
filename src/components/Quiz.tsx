import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';
import { useShallow } from 'zustand/react/shallow';
import { useTTS } from '../hooks/useTTS';

export const Quiz: React.FC = () => {
  const { 
    currentQuizList, 
    currentIndex, 
    submitAnswer, 
    nextQuestion,
    quizType
  } = useQuizStore(
    useShallow((state) => ({
      currentQuizList: state.currentQuizList,
      currentIndex: state.currentIndex,
      submitAnswer: state.submitAnswer,
      nextQuestion: state.nextQuestion,
      quizType: state.quizType
    }))
  );

  const [inputValue, setInputValue] = useState('');
  const { speak, isSpeaking } = useTTS();
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuiz = currentQuizList[currentIndex];
  const isLastQuestion = currentIndex === currentQuizList.length - 1;

  // 當進入新題目時，自動朗讀並聚焦輸入框
  useEffect(() => {
    if (currentQuiz) {
      speak(currentQuiz.chinese_prompt);
      setInputValue('');
      inputRef.current?.focus();
    }
  }, [currentIndex, currentQuiz, speak]);

  const handleNext = () => {
    submitAnswer(inputValue);
    nextQuestion();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  if (!currentQuiz) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-8">
      {/* 進度條 */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <motion.div 
          className="bg-blue-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / currentQuizList.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex justify-between w-full text-sm font-medium text-slate-400">
        <span>{quizType === 'grammar' ? '文法測驗' : '單字測驗'}</span>
        <span>題目 {currentIndex + 1} / {currentQuizList.length}</span>
      </div>

      {/* 測驗卡片 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center space-y-8"
        >
          <div className="flex flex-col items-center space-y-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => speak(currentQuiz.chinese_prompt)}
              className={`p-6 rounded-full transition-all ${
                isSpeaking ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
              }`}
            >
              <Volume2 className={`w-10 h-10 ${isSpeaking ? 'animate-pulse' : ''}`} />
            </motion.button>
            <p className="text-3xl font-bold text-slate-800 text-center">
              {currentQuiz.chinese_prompt}
            </p>
          </div>

          <div className="w-full space-y-4">
            <label className="block text-sm font-semibold text-slate-500 ml-1">
              請輸入英文解答：
            </label>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer here..."
              className="w-full p-5 text-xl bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all outline-none"
            />
          </div>

          <div className="w-full flex justify-end pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className={`flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
                isLastQuestion 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'
              }`}
            >
              {isLastQuestion ? (
                <>
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  Answer (交卷)
                </>
              ) : (
                <>
                  Next (下一題)
                  <ArrowRight className="w-6 h-6 ml-2" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 提示小工具 */}
      <div className="flex items-center text-slate-400 text-sm bg-slate-100 px-4 py-2 rounded-full">
        <HelpCircle className="w-4 h-4 mr-2" />
        <span>按下 Enter 鍵可快速進入下一題</span>
      </div>
    </div>
  );
};

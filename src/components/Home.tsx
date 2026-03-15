import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Type } from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';

export const Home: React.FC = () => {
  const selectType = useQuizStore((state) => state.selectType);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold text-slate-800">SmartEnglish Exam</h1>
        <p className="text-slate-500 text-lg">請選擇你想要練習的測驗模式</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl px-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => selectType('grammar')}
          className="flex flex-col items-center p-6 md:p-8 bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-blue-400 transition-all group"
        >
          <div className="p-3 md:p-4 bg-blue-50 rounded-full mb-3 md:mb-4 group-hover:bg-blue-100 transition-colors">
            <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-blue-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700">Grammar 測驗</h2>
          <p className="text-slate-400 mt-1 md:mt-2 text-sm md:text-base">文法對話與句子練習</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => selectType('vocabulary')}
          className="flex flex-col items-center p-6 md:p-8 bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-emerald-400 transition-all group"
        >
          <div className="p-3 md:p-4 bg-emerald-50 rounded-full mb-3 md:mb-4 group-hover:bg-emerald-100 transition-colors">
            <Type className="w-10 h-10 md:w-12 md:h-12 text-emerald-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700">Vocabulary 測驗</h2>
          <p className="text-slate-400 mt-1 md:mt-2 text-sm md:text-base">核心單字拼寫練習</p>
        </motion.button>
      </div>
    </div>
  );
};

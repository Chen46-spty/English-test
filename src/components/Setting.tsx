import React from 'react';
import { motion } from 'motion/react';
import { Shuffle, ListChecks, ArrowLeft } from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';
import { useShallow } from 'zustand/react/shallow';

export const Setting: React.FC = () => {
  const { quizType, selectMode, setStep } = useQuizStore(
    useShallow((state) => ({
      quizType: state.quizType,
      selectMode: state.selectMode,
      setStep: state.setStep
    }))
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="w-full max-w-2xl px-4">
        <button 
          onClick={() => setStep('home')}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回模式選擇
        </button>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-slate-800">
            設定測驗範圍
          </h1>
          <p className="text-slate-500">
            正在準備：<span className="font-semibold text-blue-600 capitalize">{quizType === 'grammar' ? '文法' : '單字'}</span> 測驗
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => selectMode('random')}
          className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-orange-400 transition-all group text-center"
        >
          <div className="p-4 bg-orange-50 rounded-full mb-4 group-hover:bg-orange-100 transition-colors">
            <Shuffle className="w-12 h-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-700">隨機出題 (Random)</h2>
          <p className="text-slate-400 mt-2">隨機抽選 30% 的題目進行測驗</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => selectMode('full')}
          className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-indigo-400 transition-all group text-center"
        >
          <div className="p-4 bg-indigo-50 rounded-full mb-4 group-hover:bg-indigo-100 transition-colors">
            <ListChecks className="w-12 h-12 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-700">完整出題 (Full)</h2>
          <p className="text-slate-400 mt-2">練習該類別中 100% 的所有題目</p>
        </motion.button>
      </div>
    </div>
  );
};

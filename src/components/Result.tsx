import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ChevronRight } from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';
import { useShallow } from 'zustand/react/shallow';

export const Result: React.FC = () => {
  const { currentQuizList, userAnswers, resetQuiz } = useQuizStore(
    useShallow((state) => ({
      currentQuizList: state.currentQuizList,
      userAnswers: state.userAnswers,
      resetQuiz: state.resetQuiz
    }))
  );

  const correctCount = userAnswers.filter(a => a.is_correct).length;
  const totalCount = currentQuizList.length;
  const score = Math.round((correctCount / totalCount) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* 分數看板 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="relative">
            <Trophy className="w-24 h-24 text-yellow-400" />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -top-2 -right-2 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-4 border-white"
            >
              {score}
            </motion.div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">測驗完成！</h1>
          <p className="text-slate-500 text-lg">
            你在 {totalCount} 題中答對了 <span className="font-bold text-blue-600">{correctCount}</span> 題
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetQuiz}
            className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            再試一次
          </motion.button>
        </div>
      </motion.div>

      {/* 詳細對答紀錄 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-700 ml-2">詳細對答紀錄</h2>
        <div className="space-y-4">
          {currentQuizList.map((quiz, index) => {
            const answer = userAnswers.find(a => a.quizId === quiz.id);
            const isCorrect = answer?.is_correct;

            return (
              <motion.div 
                key={quiz.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white p-6 rounded-2xl shadow-sm border-l-8 ${
                  isCorrect ? 'border-l-emerald-500' : 'border-l-red-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-mono text-sm">#{index + 1}</span>
                      <p className="font-bold text-slate-800 text-lg">{quiz.chinese_prompt}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">你的回答</p>
                        <div className={`flex items-center ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isCorrect ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                          <span className="font-medium">{answer?.user_input || '(未填寫)'}</span>
                        </div>
                      </div>
                      
                      {!isCorrect && (
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">正確解答</p>
                          <div className="flex items-center text-blue-600">
                            <ChevronRight className="w-4 h-4 mr-1" />
                            <span className="font-bold">{quiz.english_answer}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

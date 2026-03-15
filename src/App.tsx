/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQuizStore } from './store/useQuizStore';
import { Home } from './components/Home';
import { Setting } from './components/Setting';
import { Quiz } from './components/Quiz';
import { ManageBank } from './components/ManageBank';
import { Result } from './components/Result';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Monitor, Layout } from 'lucide-react';

export default function App() {
  const step = useQuizStore((state) => state.step);
  const setStep = useQuizStore((state) => state.setStep);
  const isMobileMode = useQuizStore((state) => state.isMobileMode);
  const toggleMobileMode = useQuizStore((state) => state.toggleMobileMode);

  return (
    <div className={`min-h-screen font-sans text-slate-900 flex flex-col transition-colors duration-500 ${isMobileMode ? 'bg-slate-800 py-8' : 'bg-slate-50'}`}>
      {/* 裝置切換器 (僅在桌機顯示) */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:flex space-x-2 bg-white p-2 rounded-2xl shadow-2xl border border-slate-200">
        <button 
          onClick={() => isMobileMode && toggleMobileMode()}
          className={`p-3 rounded-xl transition-all ${!isMobileMode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
          title="電腦模式"
        >
          <Monitor className="w-5 h-5" />
        </button>
        <button 
          onClick={() => !isMobileMode && toggleMobileMode()}
          className={`p-3 rounded-xl transition-all ${isMobileMode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
          title="手機模式"
        >
          <Smartphone className="w-5 h-5" />
        </button>
      </div>

      <div className={`mx-auto flex flex-col transition-all duration-500 shadow-2xl overflow-hidden ${
        isMobileMode 
        ? 'w-[375px] h-[812px] bg-slate-50 rounded-[3rem] border-[12px] border-slate-900 relative' 
        : 'w-full min-h-screen shadow-none border-none'
      }`}>
        {/* 手機頂部狀態列模擬 */}
        {isMobileMode && (
          <div className="h-8 w-full bg-white flex justify-center items-end pb-1">
            <div className="w-32 h-6 bg-slate-900 rounded-b-2xl"></div>
          </div>
        )}

        <header className="bg-white border-b border-slate-200 py-3 md:py-4 px-4 md:px-6 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => useQuizStore.getState().resetQuiz()}>
              <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm md:text-base">E</span>
              </div>
              <span className={`font-bold tracking-tight text-slate-800 ${isMobileMode ? 'text-base' : 'text-xl'}`}>SmartEnglish</span>
            </div>
            <nav className="flex items-center space-x-3 md:space-x-6 text-sm font-medium text-slate-500">
              {!isMobileMode && <span className="hover:text-blue-600 cursor-pointer transition-colors">學習進度</span>}
              <button 
                onClick={() => setStep('manage')}
                className={`flex items-center px-3 py-1.5 rounded-xl transition-all ${
                  step === 'manage' 
                  ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' 
                  : 'hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <Layout className={`w-5 h-5 ${isMobileMode ? 'mr-1.5' : 'md:mr-2'}`} />
                <span className={isMobileMode ? 'text-xs' : 'text-sm'}>題庫管理</span>
              </button>
            </nav>
          </div>
        </header>

        <main className={`max-w-5xl mx-auto py-8 md:py-12 px-4 flex-grow w-full overflow-y-auto ${isMobileMode ? 'custom-scrollbar' : ''}`}>
          <AnimatePresence mode="wait">
            {step === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Home />
              </motion.div>
            )}

            {step === 'setting' && (
              <motion.div
                key="setting"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Setting />
              </motion.div>
            )}

            {step === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Quiz />
              </motion.div>
            )}

            {step === 'manage' && (
              <motion.div
                key="manage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ManageBank />
              </motion.div>
            )}

            {step === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Result />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {!isMobileMode && (
          <footer className="py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
            &copy; 2026 SmartEnglish Exam System. All rights reserved.
          </footer>
        )}
      </div>
    </div>
  );
}






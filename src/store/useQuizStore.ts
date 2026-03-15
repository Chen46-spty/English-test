import { create } from 'zustand';
import { AppStep, QuizItem, QuizMode, QuizType, UserAnswer } from '../types';
import { MOCK_QUIZ_DATA } from '../data/mockData';

interface QuizStore {
  step: AppStep;
  quizType: QuizType | null;
  quizMode: QuizMode | null;
  currentQuizList: QuizItem[];
  currentIndex: number;
  userAnswers: UserAnswer[];
  allQuizData: QuizItem[];
  isMobileMode: boolean;
  
  // Actions
  setStep: (step: AppStep) => void;
  toggleMobileMode: () => void;
  selectType: (type: QuizType) => void;
  selectMode: (mode: QuizMode) => void;
  resetQuiz: () => void;
  submitAnswer: (answer: string) => void;
  nextQuestion: () => void;
  addQuizItems: (items: Omit<QuizItem, 'id'>[]) => void;
  removeQuizItem: (id: string) => void;
  clearAllQuizData: () => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  step: 'home',
  quizType: null,
  quizMode: null,
  currentQuizList: [],
  currentIndex: 0,
  userAnswers: [],
  allQuizData: MOCK_QUIZ_DATA,
  isMobileMode: false,

  setStep: (step) => set({ step }),

  toggleMobileMode: () => set((state) => ({ isMobileMode: !state.isMobileMode })),

  selectType: (type) => set({ quizType: type, step: 'setting' }),

  selectMode: (mode) => {
    const { quizType, allQuizData } = get();
    if (!quizType) return;

    let filtered = allQuizData.filter((item) => item.type === quizType);
    
    if (mode === 'random') {
      // Shuffle and take 30% (at least 1, max all if list is small)
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      const count = Math.max(1, Math.ceil(shuffled.length * 0.3));
      filtered = shuffled.slice(0, count);
    }

    set({ 
      quizMode: mode, 
      currentQuizList: filtered, 
      currentIndex: 0, 
      userAnswers: [],
      step: 'quiz' 
    });
  },

  resetQuiz: () => set({
    step: 'home',
    quizType: null,
    quizMode: null,
    currentQuizList: [],
    currentIndex: 0,
    userAnswers: []
  }),

  submitAnswer: (answer) => {
    const { currentQuizList, currentIndex, userAnswers } = get();
    const currentQuiz = currentQuizList[currentIndex];
    
    const isCorrect = answer.trim().toLowerCase() === currentQuiz.english_answer.trim().toLowerCase();
    
    const newAnswer: UserAnswer = {
      quizId: currentQuiz.id,
      user_input: answer,
      is_correct: isCorrect
    };

    set({ userAnswers: [...userAnswers, newAnswer] });
  },

  nextQuestion: () => {
    const { currentIndex, currentQuizList } = get();
    if (currentIndex < currentQuizList.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      set({ step: 'result' });
    }
  },

  addQuizItems: (items) => {
    const { allQuizData } = get();
    const newItems = items.map(item => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    }));
    set({ allQuizData: [...allQuizData, ...newItems] });
  },

  removeQuizItem: (id) => {
    const { allQuizData } = get();
    set({ allQuizData: allQuizData.filter(item => item.id !== id) });
  },

  clearAllQuizData: () => set({ allQuizData: [] })
}));

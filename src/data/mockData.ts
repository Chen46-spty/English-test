import { QuizItem } from '../types';

export const MOCK_QUIZ_DATA: QuizItem[] = [
  // Vocabulary (單字)
  {
    id: 'v1',
    type: 'vocabulary',
    chinese_prompt: '蘋果',
    english_answer: 'apple'
  },
  {
    id: 'v2',
    type: 'vocabulary',
    chinese_prompt: '香蕉',
    english_answer: 'banana'
  },
  {
    id: 'v3',
    type: 'vocabulary',
    chinese_prompt: '電腦',
    english_answer: 'computer'
  },
  {
    id: 'v4',
    type: 'vocabulary',
    chinese_prompt: '圖書館',
    english_answer: 'library'
  },
  {
    id: 'v5',
    type: 'vocabulary',
    chinese_prompt: '學生',
    english_answer: 'student'
  },
  // Grammar (文法/句子)
  {
    id: 'g1',
    type: 'grammar',
    chinese_prompt: '我每天走路去學校。',
    english_answer: 'I walk to school every day.'
  },
  {
    id: 'g2',
    type: 'grammar',
    chinese_prompt: '你正在做什麼？',
    english_answer: 'What are you doing?'
  },
  {
    id: 'g3',
    type: 'grammar',
    chinese_prompt: '他喜歡看電影。',
    english_answer: 'He likes watching movies.'
  },
  {
    id: 'g4',
    type: 'grammar',
    chinese_prompt: '昨天天氣很好。',
    english_answer: 'The weather was good yesterday.'
  },
  {
    id: 'g5',
    type: 'grammar',
    chinese_prompt: '我想要一杯水。',
    english_answer: 'I would like a glass of water.'
  }
];

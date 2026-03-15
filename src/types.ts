/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuizType = 'grammar' | 'vocabulary';

export interface QuizItem {
  id: string;
  type: QuizType;
  chinese_prompt: string;
  english_answer: string;
}

export interface UserAnswer {
  quizId: string;
  user_input: string;
  is_correct: boolean;
}

export type QuizMode = 'random' | 'full';

export type AppStep = 'home' | 'setting' | 'quiz' | 'result' | 'manage';

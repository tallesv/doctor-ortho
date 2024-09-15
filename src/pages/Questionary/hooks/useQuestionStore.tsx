import { create } from 'zustand';

interface QuestionStore {
  blockIndex: number;
  setBlockIndex: (index: number) => void;
  questionIndex: number;
  setQuestionIndex: (index: number) => void;
}

export const useQuestionStore = create<QuestionStore>(set => ({
  blockIndex: 0,
  setBlockIndex: index => set(() => ({ blockIndex: index })),
  questionIndex: 0,
  setQuestionIndex: index => set(() => ({ questionIndex: index })),
}));

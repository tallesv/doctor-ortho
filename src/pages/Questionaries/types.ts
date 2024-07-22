export type ReplyType = {
  id: number;
  answer: string;
  question_id: number;
  next_question_id: number;
  treatment_id: number;
  coordinate: string;
};

export type QuestionType = {
  id: number;
  query: string;
  image: string;
  replies: ReplyType[];
};

export type BlockType = {
  id: number;
  name: string;
  user_id: number;
  updated_at: string;
  created_at: string;
  questions: QuestionType[];
};

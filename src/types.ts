export interface Answer {
  label: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  textRu?: string;
  hasTranslation: boolean;
  answers: Answer[];
  correctAnswer: string | null;
  isInformational: boolean;
} 
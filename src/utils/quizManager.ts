import { Question } from '../types';

export interface QuizInfo {
  id: string;
  name: string;
  description: string;
  fileName: string;
}

// Список доступных квизов
export const availableQuizzes: QuizInfo[] = [
  {
    id: 'az400',
    name: 'AZ-400: DevOps Engineer',
    description: 'Microsoft Azure DevOps Solutions certification practice questions',
    fileName: 'AzureDevOps.json'
  },
  {
    id: 'ai102',
    name: 'AI-102: AI Engineer',
    description: 'Microsoft Azure AI Engineer certification practice questions',
    fileName: 'AI102.json'
  }
  // Новые квизы можно добавлять здесь
];

// Функция загрузки вопросов из JSON файла
export const loadQuestionsFromJson = async (fileName: string): Promise<Question[]> => {
  try {
    const response = await fetch(`/${fileName}`);
    if (!response.ok) {
      throw new Error(`Failed to load quiz: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
}; 
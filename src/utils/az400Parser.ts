import { Question } from '../types';

// Function to parse AZ-400 questions from markdown content
export const parseAz400Questions = (content: string): Question[] => {
  const questions: Question[] = [];
  
  // Split content by question markers (✅ Q1, ✅ Q2, etc.)
  const questionBlocks = content.split(/(?=✅ Q\d+)/);
  
  questionBlocks.forEach((block, index) => {
    if (!block.trim()) return;
    
    // Extract question ID
    const idMatch = block.match(/✅ Q(\d+)/);
    if (!idMatch) return;
    
    const id = idMatch[1];
    
    // Extract English question text
    const englishMatch = block.match(/\*\*English \(Original\):\*\*\s*([\s\S]*?)(?=---|\*\*Русский|$)/);
    const englishText = englishMatch ? englishMatch[1].trim() : '';
    
    // Extract Russian question text
    const russianMatch = block.match(/\*\*Русский \(Перевод\):\*\*\s*([\s\S]*?)(?=✅|$)/);
    const russianText = russianMatch ? russianMatch[1].trim() : '';
    
    // Extract answers
    const answers: { label: string; text: string }[] = [];
    const answerRegex = /^([A-D])\.\s*([^\n]+)/gm;
    let answerMatch;
    
    while ((answerMatch = answerRegex.exec(block)) !== null) {
      answers.push({
        label: answerMatch[1],
        text: answerMatch[2].trim()
      });
    }
    
    // Find correct answer(s)
    let correctAnswer: string | string[] | null = null;
    const isMultipleChoice = block.includes('Select all that apply') || 
                            block.includes('Выберите все подходящие варианты');
    
    if (isMultipleChoice) {
      // For multiple choice, find all answers marked with ✅
      const correctMatches = block.match(/✅\s*([A-D])/g);
      if (correctMatches) {
        correctAnswer = correctMatches.map(match => {
          const letterMatch = match.match(/✅\s*([A-D])/);
          return letterMatch ? letterMatch[1] : '';
        }).filter(Boolean);
      }
    } else {
      // For single choice, find the first answer marked with ✅
      const correctMatch = block.match(/✅\s*([A-D])/);
      if (correctMatch) {
        correctAnswer = correctMatch[1];
      }
    }
    
    // Check if it's an informational question
    const isInformational = block.includes('informational') || 
                           block.includes('This is an informational question');
    
    // Create question object
    const question: Question = {
      id,
      text: englishText,
      textRu: russianText,
      hasTranslation: !!russianText,
      answers,
      correctAnswer,
      isInformational,
      isMultipleChoice
    };
    
    questions.push(question);
  });
  
  return questions;
};

// Predefined AZ-400 questions
export const az400Questions: Question[] = [
  {
    id: "1",
    text: "Your company has an Azure DevOps environment that can only be accessed by Azure Active Directory users. You are instructed to make sure that the Azure DevOps environment can only be accessed from devices connected to the company's on-premises network. Which of the following actions should you take?",
    textRu: "Ваша компания имеет среду Azure DevOps, доступ к которой имеют только пользователи Azure Active Directory. Вам поручено убедиться, что среда Azure DevOps доступна только с устройств, подключенных к локальной сети компании. Какое из следующих действий следует предпринять?",
    hasTranslation: true,
    answers: [
      { label: "A", text: "Assign the devices to a security group." },
      { label: "B", text: "Create a GPO." },
      { label: "C", text: "Configure Security in Project Settings from Azure DevOps." },
      { label: "D", text: "Configure conditional access in Azure Active Directory." }
    ],
    correctAnswer: "D",
    isInformational: false,
    isMultipleChoice: false
  },
  {
    id: "2",
    text: "You are making use of Azure DevOps to configure Azure Pipelines for project, named PROJ-01. You are preparing to use a version control system that allows for source code to be stored on a managed Windows server located on the company network. Which of the following is the version control system you should use?",
    textRu: "Вы используете Azure DevOps для настройки Azure Pipelines для проекта с именем PROJ-01. Вы готовитесь использовать систему управления версиями, которая позволяет хранить исходный код на управляемом сервере Windows, находящемся в сети компании. Какую из следующих систем управления версиями следует использовать?",
    hasTranslation: true,
    answers: [
      { label: "A", text: "Github Enterprise" },
      { label: "B", text: "Bitbucket cloud" },
      { label: "C", text: "Github Professional" },
      { label: "D", text: "Git in Azure Repos" }
    ],
    correctAnswer: "A",
    isInformational: false,
    isMultipleChoice: false
  },
  {
    id: "3",
    text: "Your company hosts a web application in Azure, and makes use of Azure Pipelines for managing the build and release of the application. When stakeholders report that system performance has been adversely affected by the most recent releases, you configure alerts in Azure Monitor. You are informed that new releases must satisfy specified performance baseline conditions in the staging environment before they can be deployed to production. You need to make sure that releases not satisfying the performance baseline are prevented from being deployed. Which of the following actions should you take?",
    textRu: "Ваша компания размещает веб-приложение в Azure и использует Azure Pipelines для управления сборкой и релизом приложения. После того как заинтересованные стороны сообщили о снижении производительности системы из-за последних релизов, вы настроили оповещения в Azure Monitor. Вас проинформировали, что новые релизы должны соответствовать определённым условиям базовой производительности в staging-среде до развертывания в production. Вам нужно гарантировать, что релизы, не соответствующие этим условиям, не будут развернуты. Какое из следующих действий следует предпринять?",
    hasTranslation: true,
    answers: [
      { label: "A", text: "You should make use of a branch control check." },
      { label: "B", text: "You should make use of an alert trigger." },
      { label: "C", text: "You should make use of a gate." },
      { label: "D", text: "You should make use of an approval check." }
    ],
    correctAnswer: "C",
    isInformational: false,
    isMultipleChoice: false
  }
];

// Function to load AZ-400 questions from file
export const loadAz400Questions = async (): Promise<Question[]> => {
  try {
    const response = await fetch('/az400-questions.json');
    if (response.ok) {
      return await response.json();
    }
    // Fallback to predefined questions if file not found
    return az400Questions;
  } catch (error) {
    console.error('Error loading AZ-400 questions:', error);
    return az400Questions;
  }
}; 
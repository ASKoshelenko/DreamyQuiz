export interface Question {
  id: string;
  text: string;
  textRu?: string;
  answers: Array<{
    label: string;
    text: string;
  }>;
  correctAnswer: string | string[] | null;
  isInformational: boolean;
  hasTranslation: boolean;
  isMultipleChoice?: boolean;
}

export function parseQuestions(markdownContent: string): Question[] {
  try {
    const questions: Question[] = [];
    const blocks = markdownContent.split(/✅\s*Q\d+\s*/).filter(block => block.trim());

    blocks.forEach((block, index) => {
      let questionText = '';
      let questionTextRu = '';
      let answers: Array<{ label: string; text: string }> = [];
      let correctAnswer: string | string[] | null = null;
      let hasTranslation = false;
      let isMultipleChoice = false;

      // Check if this is a multiple choice question
      if (block.includes('Select all that apply') || block.includes('Выберите все подходящие варианты')) {
        isMultipleChoice = true;
      }

      // Split block into English and Russian parts
      const parts = block.split(/---\s*\*\*Русский \(Перевод\):\*\*/);
      
      // Process English part
      let englishPart = parts[0];
      if (englishPart) {
        // Extract English question text
        const questionMatch = englishPart.match(/\*\*(?:Question|English \(Original\)?):\*\*\s*([\s\S]*?)(?=\s*[A-D]\.|$)/);
        if (questionMatch) {
          questionText = questionMatch[1].trim();
        }

        // Extract answers and correct answer from English part
        const answerLines = englishPart.split('\n');
        answerLines.forEach(line => {
          // Match answer lines
          const answerMatch = line.match(/^([A-D])\.\s*(.+?)(?:\s*✅\s*)?$/);
          if (answerMatch) {
            const [, label, text] = answerMatch;
            answers.push({ label, text: text.trim() });
            
            // Check if this is the correct answer
            if (line.includes('✅')) {
              if (isMultipleChoice) {
                if (!Array.isArray(correctAnswer)) {
                  correctAnswer = [];
                }
                (correctAnswer as string[]).push(label);
              } else {
                correctAnswer = label;
              }
            }
          }
        });
      }

      // Process Russian part if exists
      if (parts[1]) {
        hasTranslation = true;
        questionTextRu = parts[1].split(/\s*[A-D]\./).shift()?.trim() || '';
      }

      // Create question object
      const question: Question = {
        id: (index + 1).toString(),
        text: questionText,
        textRu: questionTextRu || undefined,
        answers,
        correctAnswer,
        isInformational: false,
        hasTranslation,
        isMultipleChoice
      };

      questions.push(question);
    });

    return questions;
  } catch (error) {
    console.error('Error parsing questions:', error);
    return [];
  }
} 
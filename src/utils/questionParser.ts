export interface Question {
  id: string;
  text: string;
  textRu?: string;
  answers: Array<{
    label: string;
    text: string;
  }>;
  correctAnswer: string | null;
  isInformational: boolean;
  hasTranslation: boolean;
}

export function parseQuestions(markdownContent: string): Question[] {
  try {
    const questions: Question[] = [];
    const blocks = markdownContent.split('✅ Q').filter(block => block.trim());

    blocks.forEach((block, index) => {
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      let questionText = '';
      let questionTextRu = '';
      let answers: Array<{ label: string; text: string }> = [];
      let correctAnswer: string | null = null;
      let isCollectingEnglish = false;
      let isCollectingRussian = false;
      let hasTranslation = false;
      let seenAnswers = new Set<string>();

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip empty lines and question number
        if (!line || line.match(/^\d+$/)) continue;

        // Check for English question start
        if (line.includes('**Question:**') || line.includes('**English (Original):**')) {
          isCollectingEnglish = true;
          isCollectingRussian = false;
          continue;
        }

        // Check for Russian translation start
        if (line.includes('**Русский (Перевод):**')) {
          isCollectingEnglish = false;
          isCollectingRussian = true;
          hasTranslation = true;
          continue;
        }

        // Check for section separator
        if (line === '---') {
          isCollectingEnglish = false;
          isCollectingRussian = false;
          continue;
        }

        // Parse answer options (only in English section)
        if (isCollectingEnglish) {
          const answerMatch = line.match(/^([A-Z])\.\s*(.*?)(\s*✅)?$/);
          if (answerMatch) {
            const [, label, text, isCorrect] = answerMatch;
            if (!seenAnswers.has(label)) {
              answers.push({ label, text: text.trim() });
              seenAnswers.add(label);
              if (isCorrect) {
                correctAnswer = label;
              }
            }
            continue;
          }
        }

        // Collect question text
        if (isCollectingEnglish && !line.includes('**NOTE:**') && !line.includes('**Question:**') && !line.includes('**English (Original):**')) {
          questionText += (questionText ? '\n' : '') + line;
        } else if (isCollectingRussian && !line.includes('**Примечание:**') && !line.includes('**Русский (Перевод):**')) {
          questionTextRu += (questionTextRu ? '\n' : '') + line;
        }
      }

      // Only add questions that have text
      if (questionText.trim()) {
        questions.push({
          id: String(index + 1),
          text: questionText.trim(),
          textRu: hasTranslation ? questionTextRu.trim() : undefined,
          answers,
          correctAnswer,
          isInformational: answers.length === 0,
          hasTranslation
        });
      }
    });

    return questions;
  } catch (error) {
    console.error('Error parsing questions:', error);
    return [];
  }
} 
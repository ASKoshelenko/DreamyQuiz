# DreamyQuiz

A modern, responsive quiz application built with React and TypeScript, featuring a bilingual interface (English/Russian) and support for markdown-formatted questions.

## Features

- 📝 Support for markdown-formatted quiz files
- 🌍 Bilingual support (English/Russian)
- 📱 Responsive design with Tailwind CSS
- 🎯 Progress tracking
- 🔄 Question navigation
- 🎨 Modern and clean UI
- 📊 Score calculation
- 🔍 Question preview

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ASKoshelenko/DreamyQuiz.git
```

2. Navigate to the project directory:
```bash
cd DreamyQuiz
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Question File Format

The application accepts markdown files with questions in the following format:

```markdown
✅ Q1
**English (Original):**
Your question text here.
A. First option
B. Second option
C. Third option ✅
D. Fourth option
---
**Русский (Перевод):**
Текст вашего вопроса здесь.
A. Первый вариант
B. Второй вариант
C. Третий вариант ✅
D. Четвертый вариант
```

### Question File Requirements:

- Questions must start with `✅ Q` followed by a number
- Each question can have both English and Russian versions
- Correct answers are marked with ✅
- Sections are separated by `---`
- Answer options must start with a capital letter followed by a period (e.g., "A.")

## Features in Detail

### File Upload
- Drag and drop support
- File validation
- Progress indication

### Quiz Interface
- Question navigation (Previous/Next)
- Language toggle (EN/RU)
- Progress tracking
- Score calculation
- Answer feedback
- Question navigator grid

### Question Display
- Clear question text
- Multiple choice answers
- Visual feedback for correct/incorrect answers
- Support for informational questions

## Built With

- [React](https://reactjs.org/) - Frontend framework
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Create React App](https://create-react-app.dev/) - Project bootstrapping

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to everyone who contributes to making this project better
- Special thanks to the React and TypeScript communities for their excellent documentation 
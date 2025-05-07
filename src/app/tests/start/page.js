// app/start/page.js
import ClientWrapper from "@/components/start/ClientWrapper";

// Sample IQ questions - this would be replaced with your data source
const questions = [
  {
    id: 1,
    question: "What number comes next in the sequence: 2, 4, 8, 16, ?",
    options: ["24", "32", "28", "30"],
    correctAnswer: "32",
  },
  {
    id: 2,
    question: "If you rearrange the letters d, you would have the name of a:",
    options: ["Country", "Animal", "City", "Ocean"],
    correctAnswer: "Country",
  },
  {
    id: 3,
    question: "Which figure completes the pattern?",
    imageSrc: "/patterns/pattern3.svg",
    options: ["A", "B", "C", "D"],
    correctAnswer: "C",
  },
];

// Create exactly 20 questions with fixed ids
const fullQuestions = [];
for (let i = 0; i < 20; i++) {
  fullQuestions.push({
    ...questions[i % questions.length],
    id: i + 1,
  });
}

export default function StartPage() {
  return <ClientWrapper questions={fullQuestions} />;
}

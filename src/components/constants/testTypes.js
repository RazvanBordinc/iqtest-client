// src/components/constants/testTypes.js

export const TEST_TYPES = [
  {
    id: "number-logic",
    title: "Numerical Reasoning",
    shortTitle: "Numerical",
    description:
      "Analyze patterns, solve equations, and demonstrate mathematical intelligence",
    longDescription:
      "Test your ability to recognize numerical patterns, solve complex mathematical puzzles, and think quantitatively under time constraints.",
    icon: "Calculator",
    color: "from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
    stats: {
      questionsCount: 24,
      timeLimit: "18 minutes",
      difficulty: "Adaptive",
      difficultyRating: 3,
      maxDifficulty: 5,
      minutes: 18,
    },
  },
  {
    id: "word-logic",
    title: "Verbal Intelligence",
    shortTitle: "Verbal",
    description:
      "Process language, understand relationships between words, and analyze text",
    longDescription:
      "Challenge your vocabulary knowledge, comprehension of word relationships, and ability to extract meaning from complex language structures.",
    icon: "BookText",
    color:
      "from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600",
    stats: {
      questionsCount: 28,
      timeLimit: "20 minutes",
      difficulty: "Adaptive",
      difficultyRating: 3,
      maxDifficulty: 5,
      minutes: 20,
    },
  },
  {
    id: "memory",
    title: "Memory & Recall",
    shortTitle: "Memory",
    description:
      "Test working memory capacity, recall accuracy, and information retention",
    longDescription:
      "Evaluate your short-term memory capacity, information retention abilities, and recall accuracy across various cognitive challenges.",
    icon: "Brain",
    color:
      "from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600",
    stats: {
      questionsCount: 20,
      timeLimit: "15 minutes",
      difficulty: "Adaptive",
      difficultyRating: 3,
      maxDifficulty: 5,
      minutes: 15,
    },
  },
  {
    id: "mixed",
    title: "Comprehensive IQ",
    shortTitle: "Mixed",
    description:
      "Full cognitive assessment combining all major intelligence domains",
    longDescription:
      "A balanced assessment combining multiple cognitive domains for a complete evaluation of general intelligence and cognitive capability.",
    icon: "Sparkles",
    color:
      "from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600",
    stats: {
      questionsCount: 40,
      timeLimit: "35 minutes",
      difficulty: "Adaptive",
      difficultyRating: 5,
      maxDifficulty: 5,
      minutes: 35,
    },
  },
];

export const getTestTypeById = (id) => {
  return TEST_TYPES.find((test) => test.id === id) || null;
};
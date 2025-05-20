// Fallback test questions for when the backend doesn't return valid data

export const fallbackMemoryQuestions = [
  {
    id: 101,
    type: "memory-pair",
    category: "memory",
    text: "Recall the missing words from each pair",
    memorizationTime: 15,
    pairs: [
      ["Apple", "Orange"],
      ["Sky", "Ocean"],
      ["Mountain", "Valley"],
      ["Book", "Knowledge"],
      ["Sun", "Moon"]
    ],
    missingIndices: [
      [1], // Apple -> ?
      [0], // ? -> Ocean
      [1], // Mountain -> ?
      [0], // ? -> Knowledge
      [1]  // Sun -> ?
    ]
  },
  {
    id: 102,
    type: "memory-pair",
    category: "memory",
    text: "Fill in the missing words from these triplets",
    memorizationTime: 20,
    pairs: [
      ["Past", "Present", "Future"],
      ["Breakfast", "Lunch", "Dinner"],
      ["Gold", "Silver", "Bronze"],
      ["Earth", "Wind", "Fire"]
    ],
    missingIndices: [
      [1], // Past -> ? -> Future
      [0, 2], // ? -> Lunch -> ?
      [1], // Gold -> ? -> Bronze
      [0, 1] // ? -> ? -> Fire
    ]
  }
];

export const fallbackNumericalQuestions = [
  {
    id: 201,
    type: "multiple-choice",
    category: "number-logic",
    text: "What is the next number in the sequence: 2, 4, 8, 16, __?",
    options: ["24", "32", "30", "28"],
    correctAnswer: "32"
  },
  {
    id: 202,
    type: "fill-in-gap",
    category: "number-logic",
    text: "If a shirt costs $24 and is on sale for 25% off, what is the sale price?",
    correctAnswer: "18"
  },
  {
    id: 203,
    type: "multiple-choice",
    category: "number-logic",
    text: "Which of these fractions is largest?",
    options: ["3/8", "5/12", "1/3", "2/5"],
    correctAnswer: "2/5"
  }
];

export const fallbackVerbalQuestions = [
  {
    id: 301,
    type: "multiple-choice",
    category: "word-logic",
    text: "Choose the word that is most OPPOSITE in meaning to CONCEAL:",
    options: ["Hide", "Reveal", "Cover", "Obscure"],
    correctAnswer: "Reveal"
  },
  {
    id: 302,
    type: "fill-in-gap",
    category: "word-logic",
    text: "Complete the analogy: Bird is to nest as human is to ____.",
    correctAnswer: "house"
  },
  {
    id: 303,
    type: "multiple-choice",
    category: "word-logic",
    text: "Which word does NOT belong in this group?",
    options: ["Lion", "Tiger", "Elephant", "Wolf"],
    correctAnswer: "Elephant"
  }
];

export const fallbackMixedQuestions = [
  // Take multiple numeric, verbal, and memory questions to create a better mixed test
  ...fallbackNumericalQuestions,
  ...fallbackVerbalQuestions,
  ...fallbackMemoryQuestions,
  // Add some additional mixed-specific questions
  {
    id: 401,
    type: "multiple-choice",
    category: "mixed",
    text: "Which shape comes next in this pattern? □ △ □ △ □ ?",
    options: ["□", "△", "○", "⬡"],
    correctAnswer: "△"
  },
  {
    id: 402,
    type: "fill-in-gap",
    category: "mixed",
    text: "Jane is twice as old as Tom was when Jane was as old as Tom is now. If Jane is 24, how old is Tom?",
    correctAnswer: "18"
  },
  {
    id: 403,
    type: "multiple-choice",
    category: "mixed",
    text: "All of these words share a common characteristic EXCEPT one. Which is the exception?",
    options: ["Apple", "Banana", "Grape", "Lettuce"],
    correctAnswer: "Lettuce"
  }
];

// Get fallback questions by test type
export const getFallbackQuestions = (testType) => {
  switch (testType) {
    case "memory":
      return fallbackMemoryQuestions;
    case "number-logic":
      return fallbackNumericalQuestions;
    case "word-logic":
      return fallbackVerbalQuestions;
    case "mixed":
      return fallbackMixedQuestions;
    default:
      return [];
  }
};

export default getFallbackQuestions;
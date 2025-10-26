// Mock challenge data for demo/testing mode (when OpenAI key is not available)

// Extended questions for better variety
const extendedMockQuestions = {
  music: [
    { type: 'music', prompt: 'Who wrote the song "Bohemian Rhapsody"?', options: ['The Beatles', 'Queen', 'Led Zeppelin', 'Pink Floyd'], answer: 1, difficulty: 'easy' },
    { type: 'music', prompt: 'Which instrument has 88 keys?', options: ['Guitar', 'Piano', 'Violin', 'Drums'], answer: 1, difficulty: 'easy' },
    { type: 'music', prompt: 'What is a group of 8 musicians called?', options: ['Quintet', 'Sextet', 'Septet', 'Octet'], answer: 3, difficulty: 'medium' },
    { type: 'music', prompt: 'Who composed "The Four Seasons"?', options: ['Mozart', 'Bach', 'Vivaldi', 'Beethoven'], answer: 2, difficulty: 'medium' },
    { type: 'music', prompt: 'What genre does Michael Jackson belong to?', options: ['Rock', 'Pop', 'Jazz', 'Country'], answer: 1, difficulty: 'easy' }
  ],
  logic: [
    { type: 'logic', prompt: 'If all roses are flowers, and some flowers are red:', options: ['All roses are red', 'Some roses may be red', 'No roses are red', 'Cannot determine'], answer: 1, difficulty: 'medium' },
    { type: 'logic', prompt: 'What comes next? 2, 4, 8, 16, ?', options: ['20', '24', '32', '28'], answer: 2, difficulty: 'easy' },
    { type: 'logic', prompt: 'If Monday is first, what day is in the middle?', options: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], answer: 2, difficulty: 'easy' },
    { type: 'logic', prompt: 'If 5 cats catch 5 mice in 5 minutes:', options: ['1 minute', '5 minutes', '10 minutes', '25 minutes'], answer: 1, difficulty: 'medium' }
  ],
  trivia: [
    { type: 'trivia', prompt: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], answer: 1, difficulty: 'easy' },
    { type: 'trivia', prompt: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], answer: 2, difficulty: 'easy' },
    { type: 'trivia', prompt: 'Who painted the Mona Lisa?', options: ['Picasso', 'Van Gogh', 'Da Vinci', 'Monet'], answer: 2, difficulty: 'easy' },
    { type: 'trivia', prompt: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Rome'], answer: 1, difficulty: 'easy' }
  ],
  creative: [
    { type: 'creative', prompt: 'What is the complementary color of red?', options: ['Blue', 'Green', 'Yellow', 'Orange'], answer: 1, difficulty: 'easy' },
    { type: 'creative', prompt: 'How many primary colors are there?', options: ['2', '3', '4', '5'], answer: 1, difficulty: 'easy' },
    { type: 'creative', prompt: 'What is a haiku?', options: ['Long poem', '3-line poem', 'Song', 'Story'], answer: 1, difficulty: 'medium' }
  ],
  math: [
    { type: 'math', prompt: 'What is 15 x 3?', options: ['35', '45', '50', '55'], answer: 1, difficulty: 'easy' },
    { type: 'math', prompt: 'What is the square of 9?', options: ['72', '81', '90', '99'], answer: 1, difficulty: 'easy' },
    { type: 'math', prompt: 'What is 25% of 200?', options: ['40', '50', '60', '75'], answer: 1, difficulty: 'easy' }
  ]
};

const mockChallenges = {
  music: {
    easy: [
      { type: 'music', prompt: 'What genre is this song most likely from: "I want it that way"?', options: ['Pop', 'Rock', 'Country', 'Jazz'], answer: 0, difficulty: 'easy' },
      { type: 'music', prompt: 'Which decade is this song from: "Sweet Caroline"?', options: ['1960s', '1970s', '1980s', '1990s'], answer: 1, difficulty: 'easy' }
    ],
    medium: [
      { type: 'music', prompt: 'Name the band known for "Stairway to Heaven"', options: ['The Beatles', 'Led Zeppelin', 'Pink Floyd', 'The Rolling Stones'], answer: 1, difficulty: 'medium' }
    ],
    hard: [
      { type: 'music', prompt: 'Who composed "The Four Seasons"?', options: ['Mozart', 'Beethoven', 'Vivaldi', 'Bach'], answer: 2, difficulty: 'hard' }
    ]
  },
  logic: {
    easy: [
      { type: 'logic', prompt: 'Complete the sequence: 2, 4, 6, ?', options: ['7', '8', '9', '10'], answer: 1, difficulty: 'easy' },
      { type: 'logic', prompt: 'What comes next: A, C, E, ?', options: ['F', 'G', 'H', 'I'], answer: 1, difficulty: 'easy' }
    ],
    medium: [
      { type: 'logic', prompt: 'If all roses are flowers and some flowers are roses, which statement is true?', options: ['All flowers are roses', 'Some roses are not flowers', 'Some flowers are roses', 'No flowers are roses'], answer: 2, difficulty: 'medium' }
    ],
    hard: [
      { type: 'logic', prompt: 'A is 5 years older than B. B is 7 years younger than C. C is 23. How old is A?', options: ['20', '21', '22', '25'], answer: 1, difficulty: 'hard' }
    ]
  },
  trivia: {
    easy: [
      { type: 'trivia', prompt: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'], answer: 1, difficulty: 'easy' },
      { type: 'trivia', prompt: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], answer: 1, difficulty: 'easy' }
    ],
    medium: [
      { type: 'trivia', prompt: 'Who wrote "1984"?', options: ['J.K. Rowling', 'George Orwell', 'Ernest Hemingway', 'Mark Twain'], answer: 1, difficulty: 'medium' }
    ],
    hard: [
      { type: 'trivia', prompt: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], answer: 2, difficulty: 'hard' }
    ]
  },
  creative: {
    easy: [
      { type: 'creative', prompt: 'Which color would you mix with blue to get purple?', options: ['Red', 'Yellow', 'Green', 'Orange'], answer: 0, difficulty: 'easy' },
      { type: 'creative', prompt: 'What is the opposite of darkness?', options: ['Light', 'Shadow', 'Dim', 'Night'], answer: 0, difficulty: 'easy' }
    ],
    medium: [
      { type: 'creative', prompt: 'What literary device uses "like" or "as" for comparison?', options: ['Metaphor', 'Simile', 'Alliteration', 'Personification'], answer: 1, difficulty: 'medium' }
    ],
    hard: [
      { type: 'creative', prompt: 'In art, what does "chiaroscuro" refer to?', options: ['Color theory', 'Light and dark contrast', 'Brush strokes', 'Composition'], answer: 1, difficulty: 'hard' }
    ]
  },
  math: {
    easy: [
      { type: 'math', prompt: 'What is 15 + 27?', options: ['40', '41', '42', '43'], answer: 2, difficulty: 'easy' },
      { type: 'math', prompt: 'What is the square root of 16?', options: ['2', '3', '4', '5'], answer: 2, difficulty: 'easy' }
    ],
    medium: [
      { type: 'math', prompt: 'If x + 5 = 12, what is x?', options: ['6', '7', '8', '9'], answer: 1, difficulty: 'medium' }
    ],
    hard: [
      { type: 'math', prompt: 'What is the area of a circle with radius 5? (Use π = 3.14)', options: ['78.5', '31.4', '15.7', '25'], answer: 0, difficulty: 'hard' }
    ]
  }
};

// Get a random challenge by type and difficulty
function getMockChallenge(type, difficulty) {
  // First try extended questions for variety
  const extendedChallenges = extendedMockQuestions[type];
  
  let challenges = mockChallenges[type]?.[difficulty];
  
  // Add extended questions to increase pool
  if (extendedChallenges) {
    const filteredExtended = extendedChallenges.filter(c => c.difficulty === difficulty);
    if (challenges) {
      challenges = [...challenges, ...filteredExtended];
    } else {
      challenges = filteredExtended;
    }
  }
  
  if (!challenges || challenges.length === 0) {
    // Fallback if no challenges exist
    return {
      type: type,
      prompt: `Think carefully about this ${difficulty} ${type} challenge.`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: 0,
      difficulty: difficulty
    };
  }
  const randomIndex = Math.floor(Math.random() * challenges.length);
  return challenges[randomIndex];
}

module.exports = { getMockChallenge };

// Global Variables
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {
    overallProgress: 75,
    coursesCompleted: 12,
    badgesEarned: 3,
    quizScores: []
};

// Sample courses data
const coursesData = [
    {
        id: 1,
        title: "Advanced Calculus",
        category: "math",
        description: "Master derivatives, integrals, and advanced mathematical concepts",
        price: "$79",
        icon: "∫",
        level: "Advanced"
    },
    {
        id: 2,
        title: "Quantum Physics",
        category: "science",
        description: "Explore the fascinating world of quantum mechanics and particle physics",
        price: "$89",
        icon: "⚛️",
        level: "Expert"
    },
    {
        id: 3,
        title: "Python Programming",
        category: "programming",
        description: "Learn Python from basics to advanced web development",
        price: "$69",
        icon: "🐍",
        level: "Beginner"
    },
    {
        id: 4,
        title: "Spanish Mastery",
        category: "languages",
        description: "Become fluent in Spanish with interactive lessons and practice",
        price: "$59",
        icon: "🇪🇸",
        level: "Intermediate"
    },
    {
        id: 5,
        title: "Data Structures",
        category: "programming",
        description: "Master algorithms and data structures for coding interviews",
        price: "$79",
        icon: "🌳",
        level: "Intermediate"
    },
    {
        id: 6,
        title: "Organic Chemistry",
        category: "science",
        description: "Understand molecular structures and chemical reactions",
        price: "$75",
        icon: "🧪",
        level: "Advanced"
    },
    {
        id: 7,
        title: "Linear Algebra",
        category: "math",
        description: "Vectors, matrices, and their applications in modern mathematics",
        price: "$65",
        icon: "📐",
        level: "Intermediate"
    },
    {
        id: 8,
        title: "French Literature",
        category: "languages",
        description: "Explore classic and modern French literary works",
        price: "$55",
        icon: "📚",
        level: "Advanced"
    }
];

// Sample quiz questions
const quizQuestions = [
    {
        question: "What is the derivative of x²?",
        options: ["2x", "x²", "2", "x"],
        correct: 0
    },
    {
        question: "Which programming language is known as the 'language of the web'?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correct: 2
    },
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Madrid", "Paris"],
        correct: 3
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Silver", "Iron"],
        correct: 1
    },
    {
        question: "What is 15% of 200?",
        options: ["25", "30", "35", "40"],
        correct: 1
    }
];
